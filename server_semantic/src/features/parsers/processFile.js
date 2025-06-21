import triadWorker from "../workers/triad.worker";

export default function (rawData, typeOfFile) {
    return new Promise((resolve, reject) => {
        var instance;
        switch (typeOfFile) {
            case 'triad':
                instance = triadWorker();
                break;
        }
        instance.process(rawData).catch(() => {
            alert("Error in parsing the " + typeOfFile + " file");
            reject();
            instance.terminate();
        }).then(data => {
            resolve(data);
            instance.terminate();
        })
    })
}

