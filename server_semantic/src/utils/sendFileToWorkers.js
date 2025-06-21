/* eslint import/no-webpack-loader-syntax: off */
import gffWorker from "workerize-loader?inline!../workers/gff.worker"
// import triadWorker from "workerize-loader?inline!../workers/triad.worker";

export default function(typeOfFile, bedFile, designation, collinearityFile=undefined, additionalParams={}){
    return new Promise((resolve, reject) => {

        let instance = gffWorker();
        // switch (typeOfFile){
        //     case 'gff':
        //         instance = gffWorker()
        //         break
        //     // case 'triad':
        //     //     instance = triadWorker()
        //     //     break

        // } 
        instance.process(typeOfFile, bedFile, designation, collinearityFile).catch(() => {
            debugger
            console.log("Error in parsing file")
            // console.log("Error in parsing " + bedFile)
            reject()
            instance.terminate()
        }).then(data => {
            resolve(data)
            instance.terminate()
        })

    })
}
