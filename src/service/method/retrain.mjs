import { exec } from "child_process";
import path from "path";

export const retrainModel = async (req, res) => {
  try {
    const pythonFile = path.join(__dirname, "scripts", "retrain.py");

    exec(`python3 "${pythonFile}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({
          statusCode: 500,
          message: "Error running Python script",
          error: error.message,
        });
      }

      if (stderr) {
        console.error(`Python stderr: ${stderr}`);
      }

      // Python bisa return JSON
      let output;
      try {
        output = JSON.parse(stdout);
      } catch (e) {
        output = stdout;
      }

      return res.status(201).json({
        statusCode: 201,
        message: "Upload data and retraining model successfully",
        data: output,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};
