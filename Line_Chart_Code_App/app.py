import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, Date, cast

from flask import Flask, jsonify, render_template


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///db/project2.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
FREDdata = Base.classes.FREDdata
Metadata = Base.classes.Metadata
M_changes = Base.classes.monthly_ticker_percentage_incre
Tickerdata = Base.classes.Tickerdata

# Create our session (link) from Python to the DB


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/Metadata")
def Meta():
    """Return a list of all passenger names"""
    # Query all passengers
    session = Session(engine)
    Meta_results = session.query(Metadata.Category_Name,Metadata.Category_Number,Metadata.Category_Description).all()
    # Convert list of tuples into normal list
    Meta_data=[]
    for Category_Name, Category_Number, Category_Description in Meta_results:
            Meta_dict = {}
            Meta_dict["name"] = Category_Name
            Meta_dict["number"] = Category_Number
            Meta_dict["description"] = Category_Description
            Meta_data.append(Meta_dict)
    return jsonify(Meta_data)

#FRED data
@app.route("/FREDdata/<id>")
def Fred(id):
	"""Return a list of selected FRED data"""
	# Input parameter is Category_Number
	session = Session(engine)
	# x = session.query("select Value, Date, CAST(Value/MAX(Value) over() AS FLOAT) AS ValueToMax from FREDdata").all()
	
	FRED_results = session.query(FREDdata).filter_by(Category_Number=id).all()
	# Convert list of tuples into normal list
	FRED_data=[]
	for row in FRED_results:
		FRED_data.append({
#			"index" : row.Index,
#			"number" : row.Category_Number,
			"date" : row.Date,
#			"value" : row.Value,
			"max_value" : row.Value_to_Max_Value,
			"change_pct" : row.FRED_Percentage_Diff
		})
	return jsonify(FRED_data)

###ticker 
@app.route("/Tickerdata/<id>")
def Ticker(id):
    """Return a list of all passenger names"""
    # Query all passengers
    session = Session(engine)
    Ticker_results = session.query(Tickerdata.Index,Tickerdata.Category_Number,Tickerdata.Date,Tickerdata.Value,Tickerdata.Volume,Tickerdata.Value_to_Max_Value_Ratio).filter_by(Category_Number=id).all()
    # Convert list of tuples into normal list
    Ticker_data=[]
    for Index, Category_Number, Date,Value, Volume, Value_to_Max_Value_Ratio in Ticker_results:
            Ticker_dict = {}
            Ticker_dict["index"] = Index
            Ticker_dict["number"] = Category_Number
            Ticker_dict["date"] = Date
            Ticker_dict["value"] = Value
            Ticker_dict["volume"] = Volume
            Ticker_dict["Value_to_Max_Value_Ratio"] = Value_to_Max_Value_Ratio
            Ticker_data.append(Ticker_dict)
    return jsonify(Ticker_data)

# #monthly percentage changes
@app.route("/Mchanges")
def Mchanges():
    """Return a list of all passenger names"""
    # Query all passengers
    session = Session(engine)
    Mchanges_results = session.query(
        M_changes.Date, M_changes.xlb_value, M_changes.xlb_percentage_diff, M_changes.xlc_value, M_changes.xlc_percentage_diff, 
        M_changes.xle_value, M_changes.xle_percentage_diff, M_changes.xlf_value, M_changes.xlf_percentage_diff, 
        M_changes.xli_value, M_changes.xli_percentage_diff, M_changes.xlk_value, M_changes.xlk_percentage_diff, 
        M_changes.xlp_value, M_changes.xlp_percentage_diff, M_changes.xlre_value, M_changes.xlre_percentage_diff, 
        M_changes.xlu_value, M_changes.xlu_percentage_diff, M_changes.xlv_value, M_changes.xlv_percentage_diff, 
        M_changes.xly_value, M_changes.xly_percentage_diff, M_changes.spy_value, M_changes.spy_percentage_diff).all()
    # Convert list of tuples into normal list
    Mchanges_data=[]
    for Date, xlb_value, xlb_percentage_diff,xlc_value, xlc_percentage_diff,xle_value, xle_percentage_diff,xlf_value, xlf_percentage_diff,xli_value, xli_percentage_diff,xlk_value, xlk_percentage_diff,xlp_value, xlp_percentage_diff,xlre_value, xlre_percentage_diff,xlu_value, xlu_percentage_diff,xlv_value, xlv_percentage_diff,xly_value, xly_percentage_diff,spy_value, spy_percentage_diff in Mchanges_results:
            Mchanges_dict = {}
            Mchanges_dict["date"] = Date
            Mchanges_dict["xlb_value"]=xlb_value
            Mchanges_dict["xlb_percentage_diff"]=xlb_percentage_diff
            Mchanges_dict["xlc_value"]=xlc_value
            Mchanges_dict["xlc_percentage_diff"]=xlc_percentage_diff
            Mchanges_dict["xle_value"]=xle_value 
            Mchanges_dict["xle_percentage_diff"]=xle_percentage_diff
            Mchanges_dict["xlf_value"]=xlf_value 
            Mchanges_dict["xlf_percentage_diff"]=xlf_percentage_diff
            Mchanges_dict["xli_value"]=xli_value
            Mchanges_dict["xli_percentage_diff"]=xli_percentage_diff
            Mchanges_dict["xlk_value"]=xlk_value
            Mchanges_dict["xlk_percentage_diff"]=xlk_percentage_diff
            Mchanges_dict["xlp_value"]=xlp_value
            Mchanges_dict["xlp_percentage_diff"]=xlp_percentage_diff
            Mchanges_dict["xlre_value"]=xlre_value
            Mchanges_dict["xlre_percentage_diff"]=xlre_percentage_diff
            Mchanges_dict["xlu_value"]=xlu_value
            Mchanges_dict["xlu_percentage_diff"]=xlu_percentage_diff
            Mchanges_dict["xlv_value"]=xlv_value
            Mchanges_dict["xlv_percentage_diff"]=xlv_percentage_diff
            Mchanges_dict["xly_value"]=xly_value
            Mchanges_dict["xly_percentage_diff"]=xly_percentage_diff
            Mchanges_dict["spy_value"]=spy_value
            Mchanges_dict["spy_percentage_diff"]=spy_percentage_diff
            Mchanges_data.append(Mchanges_dict)
    return jsonify(Mchanges_data)

if __name__ == '__main__':
    app.run(debug=True)
