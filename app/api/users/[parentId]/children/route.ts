import { NextRequest, NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/utils/dynamodb";
import { EnhancedPublicUser } from "@/types/user";

function calculateTotalDescendants(children: EnhancedPublicUser[]): number {
  return children.reduce((total, child) => {
    // Count current child
    let count = 1;
    // Add all descendants if they exist
    if (child.children && child.children.length > 0) {
      count += calculateTotalDescendants(child.children);
    }
    return total + count;
  }, 0);
}

async function fetchChildrenRecursive(
  parentId: string, 
  currentDepth: number = 0
): Promise<EnhancedPublicUser[]> {
  const command = new QueryCommand({
    TableName: "users",
    IndexName: "byParent",
    KeyConditionExpression: "parentUserId = :parentId",
    ExpressionAttributeValues: {
      ":parentId": parentId,
    },
    ProjectionExpression: "userId, parentUserId, createdAt, updatedAt",
  });

  try {
    const response = await dynamoDb.send(command);
    const children = response.Items as EnhancedPublicUser[] || [];

    for (const child of children) {
      const nestedChildren = await fetchChildrenRecursive(
        child.userId,
        currentDepth + 1
      );
      
      child.children = nestedChildren;
      child.directChildrenCount = nestedChildren.length;
      child.totalDescendantsCount = calculateTotalDescendants(nestedChildren);
    }

    return children;
  } catch (error) {
    console.error(`Error fetching children for parent ${parentId}:`, error);
    return [];
  }
}

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

    const children = await fetchChildrenRecursive(parentId);

    return NextResponse.json({
      success: true,
      data: {
        children,
        totalCount: calculateTotalDescendants(children),
        parentId,
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : "Unknown error",
      time: new Date().toISOString(),
      parentId: params.parentId,
    };
    console.error("Error fetching nested children:", errorDetails);

    return NextResponse.json({
      success: false,
      error: errorDetails.message,
      metadata: {
        timestamp: errorDetails.time,
        parentId: params.parentId,
      }
    }, { status: 500 });
  }
}