import React, { useEffect, useState } from 'react'
import { Center, Text, Flex, Box, Button } from '@chakra-ui/react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"

const Chart2 = () => {
  const [postData, setPostData] = useState([]);

  const department = ['IT', 'Sales', 'HR', 'Finance', 'Marketing'];

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



  const maxSalaries = {};


  department.forEach(dep => {
    const maxSalary = postData.reduce((max, item) => {
      if (item.department === dep && item.salary > max) {
        return item.salary;
      }
      return max;
    }, 0);
    maxSalaries[dep] = maxSalary;
  });

  const data = department.map(dep => ({
    department: dep,
    salary: maxSalaries[dep]
  }));

  console.log(data +"data")

  return (
    <div>
      <Flex direction={"column"}>
        <Center border={"2px solid black"} bg='gray' h='100px' color='white'>
          <Text fontSize='4xl'> SALARY VS Department</Text>
        </Center>

        <Box marginTop={"50px"}>
          <Center>
            <LineChart width={730} height={350} data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#82ca9d" />
            </LineChart>
          </Center>
         
        </Box>
      </Flex>
    </div>
  )
}

export default Chart2;
