import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/utils/dynamodb";
import { AuthRequest, AuthResponse } from "@/types/auth";
import { hashPassphrase } from "@/utils/crypto";

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { 
          success: false,
          error: "Request body is required" 
        },
        { status: 400 }
      );
    }

    const body: AuthRequest = await request.json();

    if (!body.passphrase) {
      return NextResponse.json(
        { 
          success: false,
          error: "Passphrase is required" 
        },
        { status: 400 }
      );
    }

    // Hash the passphrase for comparison
    const hashedPassphrase = hashPassphrase(body.passphrase);

    // Query user by passphrase using GSI
    const command = new QueryCommand({
      TableName: "users",
      IndexName: "byPassphrase",
      KeyConditionExpression: "passphrase = :passphrase",
      ExpressionAttributeValues: {
        ":passphrase": hashedPassphrase,
      },
      ProjectionExpression: "userId, parentUserId, createdAt, updatedAt, isTemporary",
    });

    const response = await dynamoDb.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid passphrase",
        metadata: {
          timestamp: new Date().toISOString()
        }
      }, { status: 401 });
    }

    // Return user data without sensitive information
    const user = response.Items[0] as AuthResponse;

    return NextResponse.json({
      success: true,
      data: {
        userId: user.userId,
        parentUserId: user.parentUserId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isTemporary: user.isTemporary
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      metadata: {
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}