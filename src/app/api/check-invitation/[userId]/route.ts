import { connectDB } from "@/lib/db";
import { InvitationModel } from "@/models/invitation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";

export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/")[3];
    const recipient = url.searchParams.get("recipient");

    if (!recipient) {
      return Response.json(new ApiError(400, "Missing recipient"), {
        status: 400,
      });
    }

    // check if the user has already sent an invitation to the recipient

    const isInvited = await InvitationModel.findOne({
      sender: userId,
      recipient,
    });

    if (!isInvited) {
      return Response.json(
        new ApiSuccess(200, "No invitation sent", { inviteStatus: "unsent" }),
        {
          status: 200,
        }
      );
    }

    return Response.json(
      new ApiSuccess(200, "Invitation already sent", {
        inviteStatus: isInvited.status,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
