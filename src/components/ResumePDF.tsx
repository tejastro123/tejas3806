import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ResumeData } from "@/hooks/useResumeData";

// Register fonts if needed (optional for basic layouts)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#00e5ff",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00e5ff",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  contact: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    color: "#888",
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#00e5ff",
    textTransform: "uppercase",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  org: {
    color: "#444",
  },
  date: {
    color: "#888",
  },
  description: {
    marginTop: 4,
    lineHeight: 1.4,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 4,
  },
  skillTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontWeight: "bold",
    fontSize: 11,
  },
  projectTags: {
    fontSize: 8,
    color: "#888",
    marginTop: 2,
  }
});

interface Props {
  data: ResumeData;
}

export const ResumePDF = ({ data }: Props) => {
  const { personalInfo, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || "Mellimpudi Tejas"}</Text>
          <Text style={styles.role}>{personalInfo?.role || "AIMLDS Engineer & Physicist"}</Text>
          <View style={styles.contact}>
            <Text>{personalInfo?.email || "tejas.mellimpudi@gmail.com"}</Text>
            <Text>•</Text>
            <Text>{personalInfo?.location || "Hyderabad, India"}</Text>
          </View>
        </View>

        {/* Experience & Education */}
        <Text style={styles.sectionTitle}>Experience & Education</Text>
        {experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <View style={styles.itemHeader}>
              <Text style={styles.projectTitle}>{exp.title}</Text>
              <Text style={styles.date}>{exp.date}</Text>
            </View>
            <Text style={styles.org}>{exp.org} {exp.location ? `| ${exp.location}` : ""}</Text>
            <Text style={styles.description}>{exp.description}</Text>
            {exp.skills && exp.skills.length > 0 && (
              <View style={styles.skills}>
                {exp.skills.map((skill: string) => (
                  <Text key={skill} style={styles.skillTag}>{skill}</Text>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Projects */}
        <Text style={styles.sectionTitle}>Key Projects</Text>
        {projects.filter(p => p.featured).map((project, i) => (
          <View key={i} style={styles.projectItem}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.description}>{project.description}</Text>
            <Text style={styles.projectTags}>{project.tags?.join(" • ")}</Text>
          </View>
        ))}

        {/* Skills */}
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}>
          {skills.map((skillGroup, i) => (
            <View key={i} style={{ width: "45%" }}>
              <Text style={{ fontWeight: "bold", marginBottom: 3 }}>{skillGroup.title}</Text>
              <Text style={{ color: "#666" }}>
                {skillGroup.items?.map((s: any) => s.name).join(", ")}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
