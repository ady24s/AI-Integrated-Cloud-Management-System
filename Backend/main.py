from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from services.aws_service import fetch_ec2_instances
from services.aws_service import fetch_s3_buckets


# Initialize FastAPI app
app = FastAPI()

# Database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./cloud_resources.db"

# Create the database engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Define the Resource SQLAlchemy model
class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    resource_type = Column(String)
    status = Column(String)
    usage_hours = Column(Float)

# Create database tables
Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Define the Resource Pydantic model for input validation
class ResourceBase(BaseModel):
    name: str
    resource_type: str
    status: str
    usage_hours: float

    class Config:
        orm_mode = True

# Define the Resource Update Pydantic model
class ResourceUpdate(BaseModel):
    name: str = None
    resource_type: str = None
    status: str = None
    usage_hours: float = None

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running!"}

# GET endpoint to retrieve all resources from the database
@app.get("/resources/")
def get_resources(db: Session = Depends(get_db)):
    resources = db.query(Resource).all()
    return resources

# POST endpoint to add a new resource
@app.post("/resources/")
def create_resource(resource: ResourceBase, db: Session = Depends(get_db)):
    new_resource = Resource(
        name=resource.name,
        resource_type=resource.resource_type,
        status=resource.status,
        usage_hours=resource.usage_hours,
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

# PUT endpoint to update a resource by ID
@app.put("/resources/{resource_id}")
def update_resource(resource_id: int, updated_resource: ResourceUpdate, db: Session = Depends(get_db)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Update fields only if provided
    if updated_resource.name is not None:
        db_resource.name = updated_resource.name
    if updated_resource.resource_type is not None:
        db_resource.resource_type = updated_resource.resource_type
    if updated_resource.status is not None:
        db_resource.status = updated_resource.status
    if updated_resource.usage_hours is not None:
        db_resource.usage_hours = updated_resource.usage_hours

    db.commit()
    db.refresh(db_resource)

    return {"message": "Resource updated successfully", "resource": db_resource}

# DELETE endpoint to delete a resource by ID
@app.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()

    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(db_resource)
    db.commit()

    return {"message": "Resource deleted successfully"}

# AWS Instances endpoint
@app.get("/aws/instances")
def get_aws_instances():
    instances = fetch_ec2_instances()
    return {"instances": instances}


@app.get("/aws/s3")
def get_s3_buckets():
    buckets = fetch_s3_buckets()
    return {"buckets": buckets}

@app.get("/aws/s3")
def get_s3_buckets():
    buckets = fetch_s3_buckets()
    return {"buckets": buckets}

@app.get("/aws/idle-instances")
def get_idle_instances():
    try:
        instances = fetch_ec2_instances()
        print("Instances Fetched for Idle Check:", instances)  # Debugging
        idle_instances = find_idle_instances(instances)
        print("Returning Idle Instances:", idle_instances)  # Debugging
        return {"idle_instances": idle_instances}
    except Exception as e:
        print("Error in /aws/idle-instances Endpoint:", e)  # Debugging
        raise HTTPException(status_code=500, detail="Failed to fetch idle instances.")

