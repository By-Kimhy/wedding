/**
 * What sits behind the invitation on a wide screen: a cool, softly lit ground
 * so the card reads as an object resting on a surface. On a phone the card
 * covers it completely, so this costs nothing there.
 */
export function PageBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-backdrop">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(165deg, var(--color-backdrop), var(--color-ground-mid) 52%, var(--color-ground-end))",
        }}
      />
      <div className="absolute -top-[20%] -left-[15%] size-[55vmax] rounded-full bg-[#f4fbff] opacity-70 blur-[90px]" />
      <div className="absolute -right-[18%] -bottom-[22%] size-[60vmax] rounded-full bg-aqua opacity-55 blur-[110px]" />
      <div className="paper-grain absolute inset-0 opacity-45" />
    </div>
  );
}
