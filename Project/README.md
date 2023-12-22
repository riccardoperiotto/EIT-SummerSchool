# HAWE Hydraulik, Minimum Viable Product (MVP)
## Information
This folder contains the Minimum Viable Product (MVP) we developed for the business case assigned to our team during the Summer School.

As stated in the brochure, the company's main request was to define a way to list the assembly steps required to build a customizable product starting from a code uniquely identifying specific procedures.
In many companies similar to the one we worked with, this work is still performed by users using Excel files. The problem with this approach, apart from being subject to error and involving human operators, is that the number of available combinations grows with the number of customization possibilities.

To simplify the process, we designed a finite state machine capable of analyzing each code and creating a JSON file containing the list of the assembly steps needed. 
We modeled the state machine using Enterprise Architect, as suggested during the technical lessons we participated to.

## Demo
The MVP consists of a simple HTML+Javascript+Bootstrap website in which the user can add admissible code and obtain the sequence of assembly steps to perform to build it.

A running version of the solution can be found at [link](https://parschnell.netlify.app/).
