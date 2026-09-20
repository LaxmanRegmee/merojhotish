// app/kundali/page.tsx
import { generateFullBirthChart } from "@/libs/jyotish-engine";

export default async function KundaliReportPage() {
  const report = await generateFullBirthChart(
    new Date("1998-08-15T08:30:00Z"),
    27.7172,
    85.324,
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-nepali">
      {/* 1. Avakahada Chakra Card */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-amber-800">
          अवकहडा चक्र (जन्म विवरण)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500">राशि:</span>{" "}
            <strong>
              {report.avakahada.rashiNe} ({report.avakahada.rashiLordNe})
            </strong>
          </div>
          <div>
            <span className="text-slate-500">नक्षत्र:</span>{" "}
            <strong>
              {report.avakahada.nakshatraNe} ({report.avakahada.pada} पद)
            </strong>
          </div>
          <div>
            <span className="text-slate-500">गण:</span>{" "}
            <strong>{report.avakahada.ganaNe}</strong>
          </div>
          <div>
            <span className="text-slate-500">नाडी:</span>{" "}
            <strong>{report.avakahada.nadiNe}</strong>
          </div>
          <div>
            <span className="text-slate-500">योनि:</span>{" "}
            <strong>{report.avakahada.yoniNe}</strong>
          </div>
          <div>
            <span className="text-slate-500">वर्ण:</span>{" "}
            <strong>{report.avakahada.varnaNe}</strong>
          </div>
          <div>
            <span className="text-slate-500">पाया:</span>{" "}
            <strong>{report.avakahada.payaNe}</strong>
          </div>
        </div>
      </section>

      {/* 2. Full Planetary Positions Table */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-amber-800">
          स्पष्ट ग्रह स्थिति (Planetary Degrees)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-2">ग्रह</th>
                <th className="p-2">राशि</th>
                <th className="p-2">अंश (DMS)</th>
                <th className="p-2">भाव</th>
                <th className="p-2">नक्षत्र</th>
                <th className="p-2">नवांश (D9)</th>
                <th className="p-2">अवस्था</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((p) => (
                <tr key={p.name} className="border-b">
                  <td className="p-2 font-bold">{p.nameNe}</td>
                  <td className="p-2">{p.signNameNe}</td>
                  <td className="p-2">{p.dms}</td>
                  <td className="p-2">{p.house} भाव</td>
                  <td className="p-2">
                    {p.nakshatraNameNe} ({p.pada})
                  </td>
                  <td className="p-2">{p.d9SignNameNe}</td>
                  <td className="p-2 text-xs">
                    {p.isRetrograde && (
                      <span className="bg-red-100 text-red-700 px-1 rounded mr-1">
                        वक्र
                      </span>
                    )}
                    {p.isCombust && (
                      <span className="bg-orange-100 text-orange-700 px-1 rounded">
                        अस्त
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Vimshottari Dasha Timeline */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-amber-800">
          विंशोत्तरी महादशा चक्र
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {report.dashaTimeline.map((d, idx) => (
            <div
              key={idx}
              className="flex justify-between p-3 bg-slate-50 rounded-xl border"
            >
              <div>
                <strong>{d.planetNe} महादशा</strong> ({d.durationYears} वर्ष)
              </div>
              <div className="text-slate-600 text-xs">
                {d.startDate} देखि {d.endDate} सम्म
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Dosha Analysis */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4 text-amber-800">
          दोष एवं योग विश्लेषण
        </h2>
        <div className="space-y-2 text-sm">
          <div
            className={`p-3 rounded-xl border ${report.doshas.isManglik ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
          >
            <strong>मङ्गल दोष:</strong> {report.doshas.manglikDetailsNe}
          </div>
          <div
            className={`p-3 rounded-xl border ${report.doshas.hasKalsarpa ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-green-50 border-green-200 text-green-800"}`}
          >
            <strong>कालसर्प योग:</strong> {report.doshas.kalsarpaDetailsNe}
          </div>
        </div>
      </section>
    </div>
  );
}
