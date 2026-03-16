FROM python:3.13.5-slim

WORKDIR .

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python3", "-m", "app"]