FROM meteor/meteor-base:20211013T200759Z_489f5fe

user root

# Set the locale
RUN apt-get clean && apt-get update && apt-get install -y locales
RUN locale-gen en_US.UTF-8

USER mt
WORKDIR /home/mt

ADD Prebuild.mk .
ADD app/package.json app/
ADD app/.meteor/packages app/.meteor/release app/.meteor/versions app/.meteor/.finished-upgraders app/.meteor/.gitignore app/.meteor/

USER root
RUN chmod 777 -R app/
USER mt

RUN make -f Prebuild.mk INSTALL_DEPS

USER root
RUN ls -hl . && rm -rf app/.meteor/
USER mt

ADD Makefile .

CMD ["make", "RUN"]
