import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function ArticleLoading() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <LoadingIndicator show={true} text="Loading article..." />
        </div>
    );
}
