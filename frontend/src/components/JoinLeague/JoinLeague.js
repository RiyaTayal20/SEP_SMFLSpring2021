function joinLeague(){

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
    const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

     setValidated(true);
    };


return(  
<div>
  <div>
    <div className="join-league-form-title" noValidate validated={validated} onSubmit={handleSubmit}></div>
      <Row>
        <Col>
          <h2 className="order-title">Join a League</h2>
        </Col>
        <Col sm={2}>
          <Button type="submit">Refresh</Button>
        </Col>
      </Row>
   </div>


 <Form className="join-league-form" >
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>League Name</th>
          <th>End Date</th>
          <th>Members</th>
          <th> Join</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>League Name 1</td>
          <td> 10/21 </td>
          <td> 10 </td>
          <td>   
            <Button type="submit">Join League</Button>
          </td>
        </tr>
        <tr>
          <td>League Name 2</td>
          <td>3/20</td>
          <td> 7 </td>
          <td> 
            <Button type="submit">Join League</Button> 
          </td>
        </tr>
        <tr>
          <td>League Name 3</td>
          <td>8/24</td>
          <td> 12 </td>
          <td>   
            <Button type="submit">Join League</Button> 
          </td>
        </tr>
        <tr>
          <td>League Name 4</td>
          <td>6/12</td>
          <td> 13 </td>
          <td>  
            <Button type="submit">Join League</Button> 
          </td>
        </tr>
        <tr>
          <td>League Name 5</td>
          <td>9/30</td>
          <td> 12 </td>
          <td>  
            <Button type="submit">Join League</Button>
          </td>
        </tr>
      </tbody>
    </Table>


<Form.Group controlId="Private Key">
  <Row>
    <Form.Label>
      Private Key:
    </Form.Label>
    <Col>
      <Form.Control type="text" placeholder="Enter private key here" required/>
      <Form.Control.Feedback type="invalid">
                        Please provide a Private Key.
      </Form.Control.Feedback>
    </Col>
    <Col>
      <Button type="submit">Join League</Button>
    </Col>
  </Row>
</Form.Group>
  </Form>
</div>

   )
}
