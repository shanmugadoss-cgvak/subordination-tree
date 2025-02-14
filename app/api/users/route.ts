import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/utils/dynamodb";
import { CreateUserRequest, User } from "@/types/user";
import crypto from "crypto";
import { validateUser } from "@/middleware/validateUser";
import { hashPassphrase } from "@/utils/crypto";
import { validatePassphrase } from "@/utils/validation";

// Add check for unique passphrase
async function isPassphraseUnique(passphrase: string): Promise<boolean> {
  const command = new QueryCommand({
    TableName: "users",
    IndexName: "byPassphrase",
    KeyConditionExpression: "passphrase = :passphrase",
    ExpressionAttributeValues: {
      ":passphrase": hashPassphrase(passphrase),
    },
    ProjectionExpression: "userId",
  });

  const response = await dynamoDb.send(command);
  return !response.Items || response.Items.length === 0;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request format
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const body: CreateUserRequest = await request.json();

    // Validate request body
    const validationErrors = validateUser(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Check required fields and validate passphrase
    if (!body.passphrase) {
      return NextResponse.json(
        { error: "Passphrase is required" },
        { status: 400 }
      );
    }

    // Validate passphrase rules
    const passphraseErrors = validatePassphrase(body.passphrase);
    if (passphraseErrors.length > 0) {
      return NextResponse.json(
        { 
          error: "Invalid passphrase",
          details: passphraseErrors 
        },
        { status: 400 }
      );
    }

    // Check for unique passphrase
    const isUnique = await isPassphraseUnique(body.passphrase);
    if (!isUnique) {
      return NextResponse.json(
        { error: "Passphrase already exists" },
        { status: 409 }
      );
    }

    // Generate timestamps and ID
    const timestamp = new Date().toISOString();
    const userId = crypto.randomUUID();

    // Create user object with hashed passphrase
    const user: User = {
      userId,
      passphrase: hashPassphrase(body.passphrase), // Hash the passphrase
      parentUserId: body.parentUserId || "null", // Set default value if not provided
      isTemporary: body.isTemporary ? 1 : 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Store in DynamoDB with condition check
    try {
      await dynamoDb.send(
        new PutCommand({
          TableName: "users",
          Item: user,
          ConditionExpression: "attribute_not_exists(passphrase)",
        })
      );
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        return NextResponse.json(
          { error: "Passphrase already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Return response without passphrase
    const { passphrase, ...userWithoutPassphrase } = user;
    return NextResponse.json(userWithoutPassphrase, { status: 201 });

  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      time: new Date().toISOString()
    };
    console.error("Error creating user:", errorDetails);
    
    return NextResponse.json(
      { 
        error: errorDetails.message,
        timestamp: errorDetails.time 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: "users",
      // Optional: Limit the data returned
      ProjectionExpression: "userId, passphrase, parentUserId, isTemporary, createdAt, updatedAt",
    });

    const response = await dynamoDb.send(command);

    if (!response.Items) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    return NextResponse.json(
      { 
        users: response.Items,
        count: response.Count,
        scannedCount: response.ScannedCount
      }, 
      { status: 200 }
    );

  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      time: new Date().toISOString()
    };
    console.error("Error fetching users:", errorDetails);
    
    return NextResponse.json(
      { 
        error: errorDetails.message,
        timestamp: errorDetails.time 
      },
      { status: 500 }
    );
  }
}