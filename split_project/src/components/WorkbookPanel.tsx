import type { Slide, SlideResponse } from "../data/slides";
import { TableFill } from "./interactions/TableFill";
import { StickyBoard } from "./interactions/StickyBoard";

interface WorkbookPanelProps {
  slide: Slide;
  getResponse: (slideId: string) => SlideResponse;
  updateNote: (slideId: string, note: string) => void;
  updateInteractionData: (slideId: string, data: any) => void;
  toggleCompleted: (slideId: string) => void;
}

export const WorkbookPanel: React.FC<WorkbookPanelProps> = ({
  slide,
  getResponse,
  updateNote,
  updateInteractionData,
  toggleCompleted
}) => {
  const response = getResponse(slide.id);
  const noteLength = response.personalNote.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-black text-fubon-blue tracking-wider">
            學習工作簿 ｜ {slide.toolName || "講義重點"}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Page {slide.page.toString().padStart(2, "0")}
          </span>
        </div>
        <h2 className="text-sm font-bold text-slate-800 m-0 truncate">
          {slide.title}
        </h2>
      </div>

      {/* Panel Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">


        {/* Keywords Tags */}
        {slide.keywords && slide.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {slide.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md border border-slate-200/40"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}

        {/* Custom Interactive Section */}
        {slide.interactionType && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-3 bg-fubon-green rounded-full" />
              課堂實作互動區
            </h3>
            
            {slide.interactionType === "table-fill" && slide.interactionConfig && (
              <TableFill
                config={slide.interactionConfig}
                data={response.interactionData}
                onChange={(data) => updateInteractionData(slide.id, data)}
              />
            )}

            {slide.interactionType === "sticky-board" && slide.interactionConfig && (
              <StickyBoard
                config={slide.interactionConfig}
                data={response.interactionData}
                onChange={(data) => updateInteractionData(slide.id, data)}
              />
            )}
          </div>
        )}

        {/* Personal Notes Section */}
        {slide.allowNote && (
          <div className="border-t border-slate-100 pt-4 flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-fubon-blue rounded-full" />
                個人隨堂筆記
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {noteLength} / 10,000 字
              </span>
            </div>

            <textarea
              value={response.personalNote}
              onChange={(e) => updateNote(slide.id, e.target.value)}
              placeholder={slide.notePlaceholder || "記錄你對這張卡片的理解、講師補充、疑問或工作上的聯想……"}
              maxLength={10000}
              className="w-full h-40 p-3.5 border border-slate-200 focus:border-fubon-blue rounded-xl outline-none focus:ring-4 focus:ring-fubon-blue-glow transition-all text-xs resize-none leading-relaxed bg-slate-50 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* Panel Footer / Complete Checkbox */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="text-[10px] text-slate-400 font-semibold">
          {response.completed ? "已完成此頁學習" : "此頁尚未標記完成"}
        </div>
        
        <button
          onClick={() => toggleCompleted(slide.id)}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border ${
            response.completed
              ? "bg-fubon-green hover:bg-fubon-green-dark border-transparent text-white"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          {response.completed ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              已完成本頁
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              完成本頁
            </>
          )}
        </button>
      </div>
    </div>
  );
};
