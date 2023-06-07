import React, { useState } from "react";
import datasetData from '../data.json'
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";

  export default function Sidebar(){

    const [open, setOpen] = useState(0);
   
    const handleOpen = (value: any) => {
      setOpen(open === value ? 0 : value);
    };
   
    const customAnimation = {
      mount: { opacity:1 },
      unmount: { opacity:0 },
    };

    return(
        <div className=" h-screen w-[400px] bg-slate-200 px-4 pt-10 flex flex-col space-y-5">
            <div className="flex flex-row justify-center">
                <div className="rounded-md mx-4 bg-black text-white px-4 py-2 mb-2">Current dataset details</div>
            </div>
            <div>
            {datasetData && datasetData.map((data) => (
          <div key={data.id}>

              <Accordion open={open === data.id} animate={customAnimation}>
        <AccordionHeader className='w-full flex flex-col items-start text-start px-2 border-b border-black'>
          <div className="w-full flex justify-between">
            <h1 className='text-sm'>{data.namespace}</h1>
            <div>{open == data.id ?
            (
              <svg onClick={() => handleOpen(data.id)}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700"><path d="M5 11h14v2H5z"></path></svg>
            ):
            (
           
            <svg onClick={() => handleOpen(data.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
            )
             }</div>
          </div>
        </AccordionHeader>
        <AccordionBody className='text-justify'>
        {data.selectedTempFiles.map((file) => (
              <div key={file}>{file}</div>
            ))}
        </AccordionBody>
      </Accordion>
          </div>
        ))}
            </div>
            <div className="flex flex-row justify-center mt-5">
                <a href="/ingest">
                <div className="rounded-md mx-4 bg-blue-400 text-white px-4 py-2 mb-2 hover:bg-blue-500">Create a new dataset</div>
                </a>
            </div>
        </div>
    )
}


