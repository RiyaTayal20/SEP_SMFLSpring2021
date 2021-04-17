import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import '../../styles/CreateLeague/CreateLeague.scss';

return (

<Form>
  <Form.Group controlId="LeagueSelection">
    <Form.Label>Select League to Manage</Form.Label>
    <Form.Control as="select" htmlSize={3} custom>
      <option>League 1</option>
      <option>League 2</option>
      <option>League 3</option>
      <option>League 4</option>
      <option>League 5</option>
    </Form.Control>
  </Form.Group>
   <Table striped bordered variant="light">
     <thead>
       <tr>
         <th>Player Name</th>
         <th>Action</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td>
           Player 1
         </td>
         <td>
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> or
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
         </td>
       </tr>
       <tr>
         <td>
           Player 2
         </td>
         <td>
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> or
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
         </td>
       </tr>
       <tr>
         <td>
           Player 3
         </td>
         <td>
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> or
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
         </td>
       </tr>
       <tr>
         <td>
           Player 4
         </td>
         <td>
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Kick</Button> or
           <Button style={{ backgroundColor: 'gray', borderColor: 'gray' }}>Give Money</Button>
         </td>
       </tr>
     </tbody>
   </Table>
</Form>
  )
