-----------------------------------
- how to create pem ( for https, self signing )

	0. location

		: [Source Home]/config/https/

	1. create server.key

		openssl genrsa -des3 -out server.key 1024

		: pass phrase for server.key
			- UrQA-Node-Server-pass1)2(3*

	2. Generate a CSR

		openssl req -new -key server.key -out server.csr

		## It is example input form
		Country Name (2 letter code) [AU]:KR
		State or Province Name (full name) [Some-State]:Seoul
		Locality Name (eg, city) []:Seoul
		Organization Name (eg, company) [Internet Widgits Pty Ltd]:UrQA
		Organizational Unit Name (eg, section) []:UrQA
		Common Name (e.g. server FQDN or YOUR name) []:UrQA.io
		Email Address []:support@urqa.io 

		Please enter the following 'extra' attributes
		to be sent with your certificate request
		A challenge password []:                           
		An optional company name []:UrQA

	3. Remove Passphrase from Key 

		cp server.key key.urqa.io
		openssl rsa -in key.urqa.io -out server.key

	4. Generating a Self-Signed Certificate 

		openssl x509 -req -days 99999 -in server.csr -signkey server.key -out server.crt

	5. Installing the Private Key and Certificate 

		- use server.key, server.crt

	: create self signing
		http://www.akadia.com/services/ssh_test_certificate.html
