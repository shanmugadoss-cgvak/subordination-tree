import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/utils/dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { parentId: string } }
) {
  try {
    const { parentId } = params;

    if (!parentId) {
      return NextResponse.json(
        { error: "Parent ID is required" },
        { status: 400 }
      );
    }

    const command = new QueryCommand({
      TableName: "users",
      IndexName: "byParent",
      KeyConditionExpression: "parentUserId = :parentId",
      ExpressionAttributeValues: {
        ":parentId": parentId,
      },
      ProjectionExpression: "userId, passphrase, parentUserId, isTemporary, createdAt, updatedAt",
    });

    const response = await dynamoDb.send(command);

    if (!response.Items || response.Items.length === 0) {
      return NextResponse.json(
        { 
          message: "No children found",
          children: [] 
        }, 
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        children: response.Items,
        count: response.Count,
      },
      { status: 200 }
    );

  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      time: new Date().toISOString(),
    };
    console.error("Error fetching children:", errorDetails);

    return NextResponse.json(
      {
        error: errorDetails.message,
        timestamp: errorDetails.time,
      },
      { status: 500 }
    );
  }
}