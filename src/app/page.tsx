import { InvitationShell } from "@/components/InvitationShell";
import { wedding } from "@/data/wedding";

/**
 * Search engines and messaging apps get a proper Event description of the day,
 * built from the same data the invitation renders.
 */
function structuredData() {
  const { location } = wedding;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${wedding.couple.bride.name} & ${wedding.couple.groom.name} — Wedding`,
    startDate: wedding.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [new URL(wedding.meta.ogImage, wedding.meta.siteUrl).toString()],
    description: `Join ${wedding.couple.bride.name} & ${wedding.couple.groom.name} as they celebrate their special day.`,
    location: {
      "@type": "Place",
      name: location.venue.en,
      address: location.address.en.replace(/\n/g, ", "),
    },
    organizer: [
      { "@type": "Person", name: wedding.couple.bride.fullName.en },
      { "@type": "Person", name: wedding.couple.groom.fullName.en },
    ],
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // The payload is built from local data, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <InvitationShell />
    </>
  );
}
