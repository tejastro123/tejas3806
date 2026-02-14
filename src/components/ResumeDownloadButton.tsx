import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "./ResumePDF";
import { useResumeData } from "@/hooks/useResumeData";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { Magnetic } from "./Magnetic";

export const ResumeDownloadButton = () => {
  const { data, loading, error } = useResumeData();

  if (loading) {
    return (
      <Button variant="outline" className="rounded-full neon-border gap-2" disabled>
        <Loader2 className="animate-spin" size={18} />
        Preparing PDF...
      </Button>
    );
  }

  if (error || !data) {
    return (
      <Button variant="outline" className="rounded-full neon-border gap-2 text-destructive">
        Error loading resume data
      </Button>
    );
  }

  return (
    <Magnetic>
      <PDFDownloadLink
        document={<ResumePDF data={data} />}
        fileName={`Resume_Tejas_Mellimpudi.pdf`}
      >
        {({ loading: pdfLoading }) => (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full gap-2 neon-border hover:neon-glow hover:text-neon-cyan transition-all"
            disabled={pdfLoading}
          >
            <FileDown size={18} />
            {pdfLoading ? "Generating..." : "Download Resume"}
          </Button>
        )}
      </PDFDownloadLink>
    </Magnetic>
  );
};
