import React, { useEffect, useState } from 'react'
import { Center, Text, Flex, Box, Button, Checkbox } from '@chakra-ui/react'
import { LineChart, CartesianGrid, Label, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"

const Chart1 = () => {
  const [postData, setPostData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const dataPerPage = 10;
  const [ show , setShow] = useState(false)
  

   

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user");
      const data = await response.json();
      setPostData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = () => {
    if (startIndex + dataPerPage < postData.length) {
      setStartIndex(startIndex + dataPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - dataPerPage >= 0) {
      setStartIndex(startIndex - dataPerPage);
    }
  };


   const handleCheakBox= ()=>{
     setShow(!show)
   }

  return (
    <div>
      <Flex direction={"column"}>
        <Center border={"2px solid black"} bg='gray' h='100px' color='white'>
          <Text fontSize='4xl'> SALARY VS PERSON</Text>
        </Center>

        <Box marginTop={"50px"}>
          <Center>
            <LineChart width={730} height={350} data={postData.slice(startIndex, startIndex + dataPerPage)}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
               {
                 show ?    <XAxis dataKey="id" /> :   <XAxis dataKey="first_name" >

                    </XAxis>
               }
             
             <Tooltip />
              <YAxis   />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="first_name" stroke="#8884d8" />
              <Line type="monotone" dataKey="salary" stroke="#82ca9d" />
            </LineChart>
           
          </Center>
     <Center marginTop={"20px"}>
   <Flex gap={20}>
   <Button onClick={handlePrev}>Previous</Button>
            <Button onClick={handleNext}>Next</Button>
            <Checkbox isChecked={show} onChange={handleCheakBox}>
  id
   </Checkbox>
   </Flex>


     </Center>
        </Box>

        
      </Flex>
    </div>
  )
}

export default Chart1;
