sudo cp status-io.service /etc/systemd/system/

sudo systemctl enable status-io
sudo systemctl start status-io
sudo systemctl status status-io

