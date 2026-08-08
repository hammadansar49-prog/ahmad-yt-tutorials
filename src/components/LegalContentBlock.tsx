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
    <div className="space-y-6 text-white/70 leading-relaxed">
      {sections.map((section, i) => {
        const lines = section.split("\n");
        const [firstLine, ...rest] = lines;

        if (isHeadingLine(firstLine, rest)) {
          return (
            <div key={i}>
              <h2 className="text-lg font-bold text-white mb-2">
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
