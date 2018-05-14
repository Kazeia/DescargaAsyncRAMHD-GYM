import streamSaver from 'streamsaver';

//Return a format length of bytes: KB, MG, GB, etc. -> String
const formatBytes = (bytes, decimals) => {

    if (bytes == 0) return '0 Bytes';

    let k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//Return filename content of responseHeader.Disposition -> string
const getFileName = (disposition) => {

    if (disposition && disposition.indexOf('attachment') !== -1) {

        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(disposition);

        if (matches != null && matches[1]) return matches[1].replace(/['"]/g, '');
    }
}

//Error handler -> void()
const errorHandler = (e) => {

    console.log(e)
}

//Allow append two buffers -> Uint8Array
const appendBuffer = (buffer1, buffer2) => {

    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);

    return tmp.buffer;
};

//Return Progress downloaded in relation of 100 percent. -> int
const getProgressDownloaded = (chunkTotal, sizeFileBytes) => {

    return (chunkTotal * 100) / sizeFileBytes;
}

//RefreshSVGLogo sync with progress
const refreshSVGLogoDownloadAnim1 = (progress, arraySVGLogo) => {

    //TotalDownload = 100% -> 100/12.6 = 7.936..., parseInt(7.936...) -> 7, we only have 7 rect SVG Logo 
    let indexSVG = parseInt(progress / 12.6);
    let opacitySVG = progress / (12.6 * (indexSVG + 1));
    arraySVGLogo[indexSVG].setAttribute("opacity", opacitySVG);
}

//RefreshSVGText sync with progress
const refreshSVGTextDownloadAnim1 = (sizeFileBytes, progress, SVGText) => {

    SVGText.textContent = progress.toFixed(2) + "%"
}

//RefreshSVGText sync with bytes downloaded
const refreshSVGTextDownloadAnim2 = (chunkTotal, SVGText) => {

    SVGText.setAttribute("font-size", "39")
    SVGText.textContent = formatBytes(chunkTotal)
}

//Initial animation, only for UX purposes
const animSVGInitDownload = (SVGText, arraySVGLogo) => {

    document.getElementById("canvas_background").setAttribute("opacity", 1);
    SVGText.setAttribute("font-size", "29")
    SVGText.setAttribute("opacity", "1")
    arraySVGLogo.forEach(element => {
        element.setAttribute("opacity", "1");
    });

    SVGText.textContent = "Descargando...";
    console.log("Waiting for download...");

    animLoadingGYM = setInterval(() => {

        let tempColors = []

        for (let i = 0; i < arraySVGLogo.length; i++)
            tempColors[i] = arraySVGLogo[i].getAttribute("fill");

        for (let i = 1; i < arraySVGLogo.length; i++) {

            arraySVGLogo[i].setAttribute("fill", tempColors[i - 1]);

            if (i == arraySVGLogo.length - 1)
                arraySVGLogo[0].setAttribute("fill", tempColors[i]);
        }

    }, 100);
}

//ResetSVGLogo and SVGText, for AnimDownload1
const resetForAnim1 = (SVGText, arraySVGLogo, initialColorsSVGLogo) => {

    for (let i = 0; i < arraySVGLogo.length; i++) {
        arraySVGLogo[i].setAttribute("opacity", "0");
        arraySVGLogo[i].setAttribute("fill", initialColorsSVGLogo[i])
    }
    SVGText.textContent = "";
    SVGText.setAttribute("font-size", "50")
}

var animLoadingGYM;

//Start download
const download = () => {

    if (!streamSaver.supported) {

        alert('Your browser does not support Streams or Service Worker :(');
        return;
    }

    //Disable Button for clean download
    document.getElementById("download").disabled = true;

    //Here we instantiate variables.
    //Array of DOM SVG logo
    let arraySVGLogo = [],

        //Palette of Colors of GYM
        initialColorsSVGLogo = [],

        //The Text of DOM SVG
        SVGText = document.getElementById("svg_8"),

        //The amount of file in bytes 
        sizeFileBytes = "",

        //The Name of File
        fileName = "",

        //The chunk total downloaded
        chunkTotal = 0,

        //The progress of download(0% - 100%)
        progress = 0,

        //The ID of Drive
        IDLink = document.getElementById("IDLink").value;


    for (let i = 0; i < 8; i++) {
        arraySVGLogo[i] = document.getElementById("svg_" + i);
        initialColorsSVGLogo[i] = arraySVGLogo[i].getAttribute("fill");
    }

    //Anim Initial
    animSVGInitDownload(SVGText, arraySVGLogo);

    //Con content-length: 0Bxnfj-yjKsboclQ0S005VWctWUU
    //Sin content-length: 1FsuCRCX-ZB5FlCKVxgYNtSqU1tJetUTk

    fetch("https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=" + IDLink,
        {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow'
        }).then(response => {
            if (response.status === 404 || response.status === 400) {

                //RemoveInitDownload and reset The SVG and TXT content
                console.log("kill timeout of init Anim")
                clearTimeout(animLoadingGYM)
                SVGText.setAttribute("font-size", "50")
                SVGText.textContent = "Error"

                //Enable Button for other action
                document.getElementById("download").disabled = false;
                return;
            }
            else if (response.status === 200) {

                let fileStream;

                //Get FileName
                let disposition = response.headers.get('Content-Disposition');
                fileName = getFileName(disposition);
                console.log("Nombre del archivo: " + fileName)

                //Get SizeFile
                sizeFileBytes = response.headers.get("Content-Length");
                if (sizeFileBytes) {

                    console.log("Tamaño en bytes: " + sizeFileBytes);
                    console.log("Tamaño de archivo: " + formatBytes(sizeFileBytes));

                    //RemoveInitDownload and reset The SVG and TXT content
                    console.log("kill timeout of init Anim")
                    clearTimeout(animLoadingGYM)

                    //Reset default params for start Anim1
                    resetForAnim1(SVGText, arraySVGLogo, initialColorsSVGLogo);

                    fileStream = streamSaver.createWriteStream(fileName, sizeFileBytes);
                }
                else {

                    console.log("Tamaño de bytes 0, debido a q no posee un content-length");

                    fileStream = streamSaver.createWriteStream(fileName);
                }

                //getReader -> Firefox not supported :|, allow download a file in chunks
                const writer = fileStream.getWriter();
                const reader = response.body.getReader();

                function push() {
                    return reader.read().then(result => {
                        if (result.done) {

                            //Stop animation without Content-Length
                            if (!sizeFileBytes) clearTimeout(animLoadingGYM)

                            console.log("Enviar solicitud al Agente para cerrar el link Público");

                            //Enable Button for other action
                            document.getElementById("download").disabled = false;
                            return writer.close();
                        } else {

                            chunkTotal += result.value.length;

                            //Anim with content length?
                            if (sizeFileBytes) {

                                progress = getProgressDownloaded(chunkTotal, sizeFileBytes)

                                //Refresh SVG
                                refreshSVGTextDownloadAnim1(sizeFileBytes, progress, SVGText);
                                refreshSVGLogoDownloadAnim1(progress, arraySVGLogo);
                                console.log(progress);
                            } else {

                                //Refresh SVG
                                refreshSVGTextDownloadAnim2(chunkTotal, SVGText);
                                console.log(chunkTotal);
                            }

                            return writer.write(result.value).then(push)
                        }
                    });
                }
                push();
            }
        }).catch(errorHandler);
}

export default {

    download: download
};
