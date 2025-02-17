import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/utils/dynamodb";
import { validatePassphrase } from "@/utils/validation";
import { hashPassphrase } from "@/utils/crypto";

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { 
          success: false,
          error: "Request body is required",
          metadata: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, newPassphrase } = body;

    if (!userId || !newPassphrase) {
      return NextResponse.json(
        { 
          success: false,
          error: "userId and newPassphrase are required",
          metadata: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // First check if user exists
    const getCommand = new GetCommand({
      TableName: "users",
      Key: { userId }  // Ensure this matches the primary key attribute name in your DynamoDB table
    });

    const userResult = await dynamoDb.send(getCommand);
    if (!userResult.Item) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        metadata: {
          timestamp: new Date().toISOString()
        }
      }, { status: 404 });
    }

    // Validate new passphrase
    const validationErrors = validatePassphrase(newPassphrase);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid passphrase format",
        details: validationErrors,
        metadata: {
          timestamp: new Date().toISOString()
        }
      }, { status: 400 });
    }

    // Update passphrase
    const hashedPassphrase = hashPassphrase(newPassphrase);
    const timestamp = new Date().toISOString();

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: "users",
        Key: { userId },  // Ensure this matches the primary key attribute name in your DynamoDB table
        UpdateExpression: "SET passphrase = :newPassphrase, isTemporary = :isTemp, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":newPassphrase": hashedPassphrase,
          ":isTemp": 0,
          ":updatedAt": timestamp
        },
        ReturnValues: "ALL_NEW"
      })
    );

    return NextResponse.json({
      success: true,
      message: "Passphrase updated successfully",
      data: {       
        newPassphrase: newPassphrase
      },
      metadata: {
        timestamp
      }
    });

  } catch (error) {
    console.error("Change passphrase error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      metadata: {
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}