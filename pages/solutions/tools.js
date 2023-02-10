import React from "react";
import { Container } from "react-bootstrap";

export default function Tools() {
  return (
    <Container>
      <div className="ik_merchant">
        <h2 className="powered_title">User Tools</h2>
        <p className="powered_p">All our individual tools are free to use.</p>

        <div className="ik_merchant_content">
          <ul>
            <li>Subscriptions.</li>
            <li>PayRequests</li>
            <li>TipJar</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
