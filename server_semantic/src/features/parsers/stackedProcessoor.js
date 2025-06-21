import axios from 'axios';
import _ from 'lodash';

const getFile = function (filepath) {
    console.log(filepath)
    return new Promise((resolve, reject) => {
        // get the file
        axios.get(filepath, { headers: { 'content-encoding': 'gzip' } })
            .then((response) => { resolve(response.data) })
            // if there is an error  reject the promise and let user know through toast
            .catch((err) => {
                alert("Failed to fetch the file", "ERROR");
                reject();
            })
    });
}


async function StackedProcessor(activeChromosome, sourceID){

    let toReturn = {}

    activeChromosome = activeChromosome.toUpperCase();

    let activeSubGenome= "N/A" ;
    // let sourceID= "" ;

    toReturn.defaultSourceID = sourceID;

    // The first part tells you the reference gene file name and the second part tells you the gene expression file name
    let geneSource = sourceID.split("_")[0] + "_genes.gff",
        expressionFileSource = sourceID.split("_")[1] + ".txt";


    

    // setLoader(true)

    let geneData = [];
    getFile('files/' + geneSource)
        .then((geneFile) => {

            let lineData = geneFile.split('\n').slice(1).map((d) => d.split('\t'));

            geneData = _.groupBy(_.map(lineData, (d) => {
                let coords = _.sortBy([+d[2], +d[3]]);
                return {
                    'Chromosome': d[0],
                    'gene': d[1],
                    'start': coords[0],
                    'end': coords[1]
                };
                // group the array by Chromosome
            }), (e) => e.Chromosome);
            return getFile('files/' + expressionFileSource);
        })
        .then((rawData) => {
            // processing the data
            let lineArray = rawData.split("\n");
            let columns = lineArray.slice(0, 1)[0].trim().split('\t'),
                records = lineArray.slice(1)
                    .map((d) => {
                        let lineData = d.split('\t'), tempStore = {};
                        columns.map((columnName, columnIndex) => {
                            // typecast to number 
                            tempStore[columnName] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                        })
                        // TODO deal with +10 chromosomes
                        tempStore['activeChromosome'] = lineData[0].slice(0, 3);
                        return tempStore;
                    });

            // actions.setActiveSubGenome("N/A");


            let genomeData = _.groupBy(records, (d) => d.activeChromosome);
            let originalGenomeData = _.cloneDeep(genomeData);


            // Get the chromosome names and put into array
            let chromosomes = _.sortBy(Object.keys(genomeData));



            // Sort each array of chromosomes by the active subGenome
            _.map(chromosomes, (chromosome) => {
                genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
            })

            

            // sort the data by the default set sort key

            let chromosomeData = _.sortBy(genomeData[activeChromosome], (d) => d[activeSubGenome]);


            let originalChromosomeData = _.cloneDeep(chromosomeData);

            let something = [...columns.slice(1)]
            console.log(something)
            // setSubGenomes([...columns.slice(1)])


            // Dumping original data to window so that it can be used later on
            toReturn.triadBrowserStore = { 'chromosomeData': originalChromosomeData, 'genomeData': originalGenomeData, 'subGenomes': something};

            // actions.setDefaultDataChromosome(chromosomeData, genomeData, geneData, { start, end });

            // Set the data onto the state
            // this.setState({ subGenomes, chromosomes });
            // setSubGenomes(chromosomes)

        })
        .catch(() => {
            alert("Sorry there was an error in fetching and parsing the file");
            console.log('error');
        })
        .finally(() => { 
            // this.setState({ 'loader': false })
            // setLoader(false)
            // return "toReturn";
            
         });

         return toReturn;


         
}

export default StackedProcessor;