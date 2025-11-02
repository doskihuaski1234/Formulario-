import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Path where the Excel file will live
const DATA_DIR = path.join(__dirname, "data");
const FILE_PATH = path.join(DATA_DIR, "submissions.xlsx");

/**
 * Ensures the data directory exists.
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Append a row to the Excel workbook. If it doesn't exist, create it with headers.
 */
function appendToExcel(row) {
  ensureDataDir();

  let workbook;
  let worksheet;
  const headers = [
    "timestamp",
    "firstName",
    "lastName",
    "favoriteSport",
    "gender",
    "stateResident",
    "is21OrOlder",
    "carModelsOwned"
  ];

  if (fs.existsSync(FILE_PATH)) {
    workbook = XLSX.readFile(FILE_PATH);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
  }

  // Find current range height
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
  const nextRowIndex = range.e.r + 1; // next empty row

  const values = [
    new Date().toISOString(),
    row.firstName || "",
    row.lastName || "",
    row.favoriteSport || "",
    row.gender || "",
    row.stateResident || "",
    row.is21OrOlder ? "YES" : "NO",
    (row.carModelsOwned || []).join(", ")
  ];

  // Write row starting at A{nextRowIndex+1}
  const rowAoa = [values];
  XLSX.utils.sheet_add_aoa(worksheet, rowAoa, { origin: { r: nextRowIndex, c: 0 } });

  // Update ref
  const newRange = XLSX.utils.decode_range(worksheet["!ref"]);
  newRange.e.r = Math.max(newRange.e.r, nextRowIndex);
  worksheet["!ref"] = XLSX.utils.encode_range(newRange);

  XLSX.writeFile(workbook, FILE_PATH);
}

app.post("/api/submit", (req, res) => {
  try {
    const payload = req.body || {};

    // Basic validation
    if (!payload.firstName || !payload.lastName) {
      return res.status(400).json({ ok: false, message: "firstName and lastName are required" });
    }

    appendToExcel(payload);
    return res.json({ ok: true, message: "Saved to Excel", file: "data/submissions.xlsx" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Optional: serve the Excel file for download
app.get("/api/export", (req, res) => {
  ensureDataDir();
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ ok: false, message: "No submissions yet." });
  }
  res.download(FILE_PATH, "submissions.xlsx");
});

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
