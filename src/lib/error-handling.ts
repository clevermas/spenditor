import { MongooseError } from "mongoose";
import { NextResponse } from "next/server";

export function throwError([name, message], status = 400) {
  return NextResponse.json(
    {
      name,
      message,
    },
    { status }
  );
}

export async function handleMongoDbQuery(
  cb,
  {
    errorStatus = 400,
    notFound = ["Item not found error", "Item with requested id not found"],
    successMap = (result) => result,
    successStatus = 200,
    withoutResponse = false,
  }: {
    errorStatus?: number;
    notFound?: [string, string];
    successMap?: (result: any) => any;
    successStatus?: number;
    withoutResponse?: boolean;
  } = {}
) {
  let data;
  try {
    data = await cb();
  } catch (error) {
    const { name, message } = error as MongooseError;
    return throwError([name, message], errorStatus);
  }
  if (!data) {
    return throwError(notFound, errorStatus);
  }

  if (!withoutResponse) {
    return NextResponse.json(successMap(data), { status: successStatus });
  } else {
    return successMap(data);
  }
}
