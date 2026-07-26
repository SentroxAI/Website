import AnalyticsPanel from "./panels/AnalyticsPanel";
import ChatPanel from "./panels/ChatPanel";
import WorkflowPanel from "./panels/WorkflowPanel";
import CodePanel from "./panels/CodePanel";
import ActivityPanel from "./panels/ActivityPanel";

export default function WorkSpace() {
    return (
        <div className="grid h-full grid-cols-12 gap-4 p-6">
            <div className="col-span-7">
                <AnalyticsPanel />
            </div>

            <div className="col-span-5">
                <ChatPanel />
            </div>

            <div className="col-span-4">
                <WorkflowPanel />
            </div>

            <div className="col-span-8">
                <CodePanel />
            </div>

            <div className="col-span-12">
                <ActivityPanel />
            </div>
        </div>
    );
}