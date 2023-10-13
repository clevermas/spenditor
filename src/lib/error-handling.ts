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
  }: {
    errorStatus?: number;
    notFound?: [string, string];
    successMap?: (result: any) => any;
    successStatus?: number;
  } = {}
) {
  let data;
  try {
    data = await cb();
  } catch ({ name, message }) {
    return throwError([name, message], errorStatus);
  }
  if (!data) {
    return throwError(notFound, errorStatus);
  }

  return NextResponse.json(successMap(data), { status: successStatus });
}
