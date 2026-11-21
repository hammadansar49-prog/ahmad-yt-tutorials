function isHeadingLine(line: string, restLines: string[]) {
  return (
    restLines.length > 0 &&
    line.length > 0 &&
    line.length < 60 &&
    !line.endsWith(".") &&
    !line.endsWith(":")
  );
}

export default function LegalContentBlock({ body }: { body: string }) {
  const sections = body.split(/\n\s*\n/);

  return (
    <div className="space-y-7 text-[#2a2a33] text-[17px] leading-[1.8]">
      {sections.map((section, i) => {
        const lines = section.split("\n");
        const [firstLine, ...rest] = lines;

        if (isHeadingLine(firstLine, rest)) {
          return (
            <div key={i}>
              <h2 className="text-xl font-semibold tracking-tight text-ink mb-2">
                {firstLine}
              </h2>
              <p className="whitespace-pre-line">{rest.join("\n")}</p>
            </div>
          );
        }

        return (
          <p key={i} className="whitespace-pre-line">
            {section}
          </p>
        );
      })}
    </div>
  );
}
