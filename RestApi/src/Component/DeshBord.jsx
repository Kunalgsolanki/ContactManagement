/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable react/jsx-key */
import {
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Skeleton,
    Box,
    Container,
    Button,
    Stack,
    InputGroup,
    InputLeftElement,
    Select,
    Flex,
    InputRightElement,
    Checkbox,
    TagLabel,
    Menu, MenuButton, MenuList, MenuItem 
  } from '@chakra-ui/react';
  import { GrUpdate } from 'react-icons/gr';
  import React, { useState, useEffect, useRef } from 'react';
  import { Input } from '@chakra-ui/react';
  import { CiSearch } from 'react-icons/ci';
  import Error from '../Error';
  import exportFromJSON from 'export-from-json'
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import { MdAutoGraph } from "react-icons/md";
  import { useNavigate } from 'react-router-dom';
  
  
  
  function DeshBord() {
   
    const router = useNavigate()
    const postsRef = useRef([]);
    const updateIconRef = useRef(Array(postsRef.current.length).fill(false));
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const ageRef = useRef('');
    const salaryRef = useRef('');
    const department = ['IT', 'Sales', 'HR', 'Finance', 'Marketing'];
    const selectRef = useRef(Array(department.length).fill(false));
  
    useEffect(() => {
      fetch('http://localhost:3001/api/user')
        .then((response) => response.json())
        .then((data) => {
          postsRef.current = data;
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
          setError(true);
        });
    }, []);
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const onClickUpdateIcon = (index) => {
      const updatedIcons = [...updateIconRef.current];
      updatedIcons[index] = !updatedIcons[index];
      updateIconRef.current = updatedIcons;
    };
  
    const handleSearchElement = async () => {
      setLoading(true);
      if (searchTerm === '') {
        setShow(true);
      }
  
      try {
        const response = await fetch(`http://localhost:3001/api/user/${searchTerm}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        handleResponseData(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSalary = async (selectedSalary) => {
      if (selectedSalary.trim() === '') {
        postsRef.current = postsRef;
        return;
      }
  
      salaryRef.current = selectedSalary;
      setLoading(true);
  
      try {
        const response = await fetch(`http://localhost:3001/api/user/salary/${selectedSalary}`);
        if (!response.ok) {
          throw new Error(`Server Error ${response.status}`);
        }
  
        const data = await response.json();
        handleResponseData(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleAge = async (selectedAge) => {
      if (selectedAge.trim() === '') {
        // If no age is selected, reset to show all employees
        postsRef.current = postsRef;
        setLoading(false);
        return;
      }
  
      ageRef.current = selectedAge;
      setLoading(true);
  
      try {
        const response = await fetch(`http://localhost:3001/api/user/age/${selectedAge}`);
        if (!response.ok) {
          throw new Error(`Server Error ${response.status}`);
        }
  
        const data = await response.json();
        handleResponseData(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCheckboxChange = (index) => {
      const updatedSelect = [...selectRef.current];
      updatedSelect[index] = !updatedSelect[index];
      selectRef.current = updatedSelect;
  
      const selectedDepartments = updatedSelect.reduce((acc, isSelected, i) => {
        if (isSelected) {
          acc.push(department[i]);
        }
        return acc;
      }, []);
  
      const finalDepartments = selectedDepartments.length > 0 ? selectedDepartments : department;
  
      selectDepartment(finalDepartments);
    };
  
    const selectDepartment = async (arr) => {
      setLoading(true);
  
      try {
        const response = await fetch(`http://localhost:3001/api/user/dep/${arr}`);
        if (!response.ok) {
          throw new Error(`Server Error ${response.status}`);
        }
  
        const data = await response.json();
        handleResponseData(data);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handleResponseData = (data) => {
      if (Array.isArray(data)) {
        postsRef.current = data;
      } else if (typeof data === 'object') {
        postsRef.current = [data];
      }
    };
    
  
  
    //  function to download the csv data 
     const downloadcsv= ()=>{
    const data = postsRef.current
  const fileName = 'employee_data'
  const exportType =  exportFromJSON.types.csv
  
  exportFromJSON({ data, fileName, exportType })
     }
  //  function dlownload as pdf 
  const generatePdf = () => {
    const doc = new jsPDF();
  
    
    const headers = [['Employee Id', 'First Name', 'Last Name', 'Age', 'Email', 'Department', 'Salary', 'Hire Date', 'Manager Id', 'Job Title']];
  
    
    const data = postsRef.current.map(post => [
      post.id,
      post.first_name,
      post.last_name,
      post.age,
      post.email,
      post.department,
      post.salary,
      post.hire_date,
      post.manager_id,
      post.job_title
    ]);
  
    doc.text('Employee Data', 10, 10);
  
    doc.autoTable({
      startY: 20,
      head: headers,
      body: data
    });
  
    doc.save('employee_data.pdf');
  };
  
   const downloadXls=()=>{
    const data = postsRef.current
    const fileName = 'employee_data'
    const exportType =  exportFromJSON.types.xls
    
    exportFromJSON({ data, fileName, exportType })
  
   }
  

  //   navigate the chart1 page 
   const   hanldeNavigate=(route)=>{

    router(route)
   }
    return (
      <>
        <Container justifyContent={'flex-start'} mt={'30px'} mb={'30px'} >
          
         
          <Box>
            <Stack>
              <InputGroup>
                <InputLeftElement>
                  <CiSearch />
                </InputLeftElement>
                <Input
                  value={searchTerm}
                  onChange={handleSearch}
                  errorBorderColor={show ? 'red' : null}
                  placeholder="Search Here id or EmployeeName"
                />
                <Flex direction="column">
                  <InputRightElement>
                    <Button onClick={handleSearchElement}>
                      <CiSearch />
                    </Button>
                  </InputRightElement>
                </Flex>
              </InputGroup>
       
              <Flex direction={["column", "column"]} gap="10px">
                <Stack>
                  <Select
                    value={salaryRef.current}
                    placeholder="Select Salary"
                    onChange={(e) => handleSalary(e.target.value)}
                  >
                    <option value="50000">50000{'>'}salary</option>
                    <option value="100000">100000{'<'}salary</option>
                    <option value="500000">500000{'<'}salary</option>
                  </Select>
                </Stack>
                <Stack>
                  <Select
                    value={ageRef.current}
                    placeholder="Select Age"
                    onChange={(e) => handleAge(e.target.value)}
                  >
                    <option value="20">20{'<'}age</option>
                    <option value="50">50{'<'}age</option>
                    <option value="60">60{'<'}age</option>
                  </Select>
                </Stack>
              </Flex>
            </Stack>
            
            <Flex spacing={[1, 5]} gap={"20px"} mt={'20px'} direction={['row', 'row']} >
              {department.map((value, index) => (
                <Checkbox
                  size='md'
                  checked={selectRef.current[index]}
                  key={index}
                  onChange={() => handleCheckboxChange(index)}
                  colorScheme='blue'
                >
                  {value}
                </Checkbox>
              ))}
            </Flex>
          </Box>
          
        </Container>
  {/* button download the data  */}
        <Flex justifyContent="flex-start" position="fixed" bottom="20px" left="20px">
          {/*  download button  */}
      <Menu>
        <MenuButton as={Button} colorScheme='blue' color="white">Download</MenuButton>
        <MenuList>
          <MenuItem onClick={generatePdf}>Download as PDF</MenuItem>
          <MenuItem onClick={downloadcsv}>Download as CSV</MenuItem>
          <MenuItem onClick={downloadXls}>Download as  xsl</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  
  
    <Flex position="fixed" justifyContent="flex-end"  top="20px" left="20px">
          {/*  Chart button  */}
      <Menu>
        <MenuButton as={Button} colorScheme='gray' color="black"><MdAutoGraph/></MenuButton>
        <MenuList>
          <MenuItem onClick={()=>hanldeNavigate("/Charts1")}>Salary vs Person</MenuItem>
          <MenuItem onClick={()=>hanldeNavigate("/Charts2")}>Salary vs Department</MenuItem>
          
        </MenuList>
      </Menu>
    </Flex>
        <TableContainer m={3} overflowX={{ base: 'auto', md: 'scroll' }}>
          <Table variant="simple">
            <TableCaption> Employee Data </TableCaption>
            <Thead>
              <Tr>
                <Th>Employee Id</Th>
                <Th>first_name</Th>
                <Th>last_name</Th>
                <Th>age</Th>
                <Th>email</Th>
                <Th>department</Th>
                <Th>salary</Th>
                <Th>hire_date</Th>
                <Th>manager_id</Th>
                <Th>job_title</Th>
              </Tr>
            </Thead>
            <Tbody>
              {error ? (
                <div style={{ justifyContent: "center", display: "flex", alignItems: "center", position: "absolute", zIndex: "10" }}>
                  <Error />
                </div>
              ) : (
                <>
                  {loading ? (
                   
                    <>
                      {[...Array(5)].map((_, index) => (
                        <Tr key={index}>
                          {[...Array(10)].map((_, colIndex) => (
                            <Td key={colIndex}>
                              <Skeleton height="20px" />
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </>
                  ) : (
                 
                    postsRef.current.map((post, index) => (
                      <Tr key={index}>
                        {updateIconRef.current[index] ? (
                          <Td colSpan="10">Update Form Here</Td>
                        ) : (
                          <>
                            <Td>{post.id}</Td>
                            <Td>{post.first_name}</Td>
                            <Td>{post.last_name}</Td>
                            <Td>{post.age}</Td>
                            <Td>{post.email}</Td>
                            <Td>{post.department}</Td>
                            <Td>{post.salary}</Td>
                            <Td>{post.hire_date}</Td>
                            <Td>{post.manager_id}</Td>
                            <Td>{post.job_title}</Td>
                            <Td>
                              <Button onClick={(index) => onClickUpdateIcon(index)}>
                                <GrUpdate />
                              </Button>
                            </Td>
                          </>
                        )}
                      </Tr>
                    ))
                  )}
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  }
  
  export default DeshBord;
  