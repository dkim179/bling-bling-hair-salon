const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const BOOKING_NOTIFICATION_EMAIL = Deno.env.get("BOOKING_NOTIFICATION_EMAIL");

type BookingEmailRequest = {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  services: string[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (!RESEND_API_KEY || !BOOKING_NOTIFICATION_EMAIL) {
      console.error("Missing email configuration.");

      return new Response(
        JSON.stringify({
          error: "Email service is not configured.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const {
      appointmentDate,
      startTime,
      endTime,
      customerName,
      customerPhone,
      customerEmail,
      services,
    } = (await req.json()) as BookingEmailRequest;

    if (
      !appointmentDate ||
      !startTime ||
      !endTime ||
      !customerName ||
      !customerPhone ||
      !Array.isArray(services) ||
      services.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required booking information.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const customerEmailRow = customerEmail
      ? `
        <tr>
          <td style="padding: 5px 0; font-weight: 600;">Email</td>
          <td style="padding: 5px 0;">${customerEmail}</td>
        </tr>
      `
      : "";

    const serviceList = services
      .map((service) => `<li style="margin-bottom: 4px;">${service}</li>`)
      .join("");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bling Bling Hair Salon <onboarding@resend.dev>",
        to: [BOOKING_NOTIFICATION_EMAIL],
        subject: `New Appointment - ${appointmentDate} ${startTime}`,
        html: `
            <div
              style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                color: #302b26;
              "
            >
              <h1
                style="
                  margin-bottom: 4px;
                  font-size: 26px;
                "
              >
                New Appointment
              </h1>

              <p
                style="
                  margin-top: 0;
                  margin-bottom: 28px;
                  color: #766f68;
                "
              >
                Bling Bling Hair Salon
              </p>

              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 26px;
                "
              >
                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">
                    Date
                  </td>
                  <td style="padding: 5px 0;">
                    ${appointmentDate}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">
                    Time
                  </td>
                  <td style="padding: 5px 0;">
                    ${startTime} - ${endTime}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">
                    Customer
                  </td>
                  <td style="padding: 5px 0;">
                    ${customerName}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">
                    Phone
                  </td>
                  <td style="padding: 5px 0;">
                    ${customerPhone}
                  </td>
                </tr>

                ${customerEmailRow}
              </table>

              <h2 style="font-size: 18px;">
                Services
              </h2>

              <ul
                style="
                  padding-left: 20px;
                  margin-bottom: 28px;
                "
              >
                ${serviceList}
              </ul>

              <p
                style="
                  padding-top: 18px;
                  border-top: 1px solid #dfd2c4;
                  color: #766f68;
                  font-size: 13px;
                "
              >
                Log in to the Bling Bling admin dashboard
                to manage this appointment.
              </p>
            </div>
          `,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailData);

      return new Response(
        JSON.stringify({
          error: "Unable to send booking email.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: emailData,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected email error:", error);

    return new Response(
      JSON.stringify({
        error: "Unexpected server error.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
