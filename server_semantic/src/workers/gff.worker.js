import { parseSubmittedGFF } from "features/parsers/gffParser";

export function process(typeOfFile, gff_file, designation, collinearity_file = undefined, additionalParams = {}) {
        // USe try catch
        return new Promise(async (resolve, reject) => {
                let data;
                try {
                        data = await parseSubmittedGFF(typeOfFile, gff_file, designation, collinearity_file);
                } catch {
                        console.log("Error in parsing with process " + gff_file);
                        reject();
                        const data = undefined;
                }
                resolve(data);
        })

}

