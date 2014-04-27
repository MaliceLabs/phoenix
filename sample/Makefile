.PHONY: all
all: cert.crt dh-params.pem nginx.conf

ca.key:
	certtool --generate-privkey --hash sha256 --bits 4096 --outfile ca.key

ca.crt: ca.key ca.cfg
	certtool --generate-self-signed \
		--load-privkey ca.key \
		--template ca.cfg \
		--outfile ca.crt

cert.key: ca.crt
	certtool --generate-privkey --hash sha256 --bits 4096 --outfile cert.key

cert.csr: cert.key cert.cfg
	certtool --generate-request \
		--load-privkey cert.key \
		--template cert.cfg \
		--outfile cert.csr

cert.crt: cert.csr cert.cfg
	certtool --generate-certificate \
		--load-ca-certificate ca.crt \
		--load-ca-privkey ca.key \
		--load-request cert.csr \
		--template cert.cfg \
		--outfile cert.crt
	rm cert.csr

dh-params.pem:
	certtool --generate-dh-params --outfile dh-params.pem

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

	mv -n cert.key cert.crt $(NGINX_CONF_DIR)
	mv -i nginx.conf $(NGINX_CONF_DIR)
