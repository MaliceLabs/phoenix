GNUTLS_CERTTOOL := certtool

.PHONY: all
all: cert.crt dh-params.pem nginx.conf

ca.key:
	$(GNUTLS_CERTTOOL) --generate-privkey --hash sha256 --bits 4096 --outfile ca.key

ca.crt: ca.key ca.cfg
	$(GNUTLS_CERTTOOL) --generate-self-signed \
		--load-privkey ca.key \
		--template ca.cfg \
		--outfile ca.crt

cert.key: ca.crt
	$(GNUTLS_CERTTOOL) --generate-privkey --hash sha256 --bits 4096 --outfile cert.key

cert.csr: cert.key cert.cfg
	$(GNUTLS_CERTTOOL) --generate-request \
		--load-privkey cert.key \
		--template cert.cfg \
		--outfile cert.csr

cert.crt: cert.csr cert.cfg
	$(GNUTLS_CERTTOOL) --generate-certificate \
		--load-ca-certificate ca.crt \
		--load-ca-privkey ca.key \
		--load-request cert.csr \
		--template cert.cfg \
		--outfile cert.crt
	rm cert.csr

dh-params.pem:
	$(GNUTLS_CERTTOOL) --generate-dh-params --outfile dh-params.pem

nginx.conf: nginx.conf.template template.js
	node template username=$(shell whoami) /path/to/phoenix=$(shell dirname $$(pwd)) < nginx.conf.template > nginx.conf

.PHONY: clean
clean:
	rm -f ca.key ca.crt cert.key cert.csr cert.crt dh-params.pem nginx.conf

.PHONY: install
install:
ifndef NGINX_CONF_DIR
	$(error NGINX_CONF_DIR is required)
endif

	cp -i -t $(NGINX_CONF_DIR) cert.key cert.crt dh-params.pem
	cp -i -t $(NGINX_CONF_DIR) nginx.conf
