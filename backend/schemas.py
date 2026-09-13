from typing import Literal

from pydantic import BaseModel


class TicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str


class TicketUpdate(BaseModel):
    status: Literal["Open", "In Progress", "Closed"]
    notes: str