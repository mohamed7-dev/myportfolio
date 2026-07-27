import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";

export const { POST } = createRouter({
  POST: {
    authenticatedOnly: false,
    handler: async (req, ctx, reqContext) => {
      console.log({ ctx, reqContext, req });

      return NextResponse.json({ done: true });
    },
  },
});
