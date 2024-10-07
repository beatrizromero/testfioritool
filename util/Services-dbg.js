sap.ui.define("Coty.RawMaterial.util.Services", [
        "Coty/RawMaterial/util/Constants",
        "Coty/RawMaterial/util/Commons"],
	function(Constants, Commons) {
		'use strict';

		return {
			setModel: function(oModel) {
				this.oModel = oModel;
			},

			getModel: function() {
				return this.oModel;
            },
            
            getDropStatus: function(aFilters) {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
    
                    this.getModel().read(Constants.ENTITY_DROPSTATUSRAW, oServiceInfo);
                });
            },
            
            getRawMaterials: function(aFilters, nRows) {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                    	urlParameters: {
							"$top": nRows
						},
                        filters: aFilters,
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
    
                    this.getModel().read(Constants.ENTITY_RAWLASTVERSION, oServiceInfo);
                });
            },

			getRawMaterial: function(aMaterialData) {
				let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

				return new Promise((resolve, reject) => {
					let oServiceInfo = {
						urlParameters: {
							"$filter": sFilter
						},
						success: (oData) => {
							resolve(oData);
						},
						error: (oError) => {
							reject(oError);
						}
					};

					this.getModel().read(Constants.ENTITY_ORDERVERSION, oServiceInfo);
				});
			},

            getFunctionalities: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_FUNCTIONALITIES, oServiceInfo);
            },

            getManufacturing: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_MANUFRACTURING, oServiceInfo);
            },

            getSites: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_SITES, oServiceInfo);
            },

            getSupliers: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_SUPLIERS, oServiceInfo);
            },

            getSynonyms: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_SYNONYMS, oServiceInfo);
            },

            getSource: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_SOURCE, oServiceInfo);
            },

            getApplication: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_APPLICATION, oServiceInfo);
            },

            getHazards: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_HAZARDS, oServiceInfo);
            },
            
            getCompliance: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_COMPLIANCE, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_COMPLIANCE, oServiceInfo);
            },

			getDocument: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL_RELATIONSHIPS, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_DOCUMENTS, oServiceInfo);
            },
			
			getTestMethods: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_TESTMETHOD, oServiceInfo);
            },

            getComposition: function(aMaterialData, fnSuccess, fnError) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_DETAIL, aMaterialData);

                let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};
				this.getModel().read(Constants.ENTITY_COMPOSITION, oServiceInfo);
            },

            getVersions: function(sMaterialData) {
                let sFilter = Commons.replaceParameters(Constants.FILTER_VERSIONS, [sMaterialData]);
                
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        urlParameters: {
                            "$filter": sFilter
                        },
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
    
                    this.getModel().read(Constants.ENTITY_ORDERVERSION, oServiceInfo);
                });
            },

            getLinkDocument: function(sObjectKey) {
                return new Promise((resolve, reject) => {
                	let oServiceInfo = {
                        urlParameters: {
                        	ObjectKey: "'" + sObjectKey + "'",
	                    	ObjectType: "'DRAW'",
	                        SemanticObjectType: "''",
	                        IsDraft: true
		                },
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
    
                    this.getModel().read(Constants.ENTITY_GETALLORIGINALS, oServiceInfo);
                });
            },
            
            getDownload: function(oDocument) {
            	let aFileNameAndExtension = oDocument.Filename.split(Constants.POINT);
	            let oXhr = new window.XMLHttpRequest();
	            let sUrl = this.getModel().sServiceUrl;
	            let sServiceUrl = Commons.replaceParameters(
	            	Constants.ENTITY_ORIGINAL_CONTENT, 
	            	[oDocument.Documenttype, oDocument.Documentnumber, oDocument.Documentpart, oDocument.Documentversion, oDocument.ApplicationId, oDocument.FileId]
	            ); 
	            oXhr.open(Constants.GET_TYPE, sUrl + sServiceUrl);
	           
	            if (aFileNameAndExtension[1] !== Constants.CSV_EXTENSION) {
	                oXhr.responseType = Constants.RESPOSINVE_TYPE;
	            }
	            oXhr.onload = ()=> {
	            	window.open(URL.createObjectURL(oXhr.response));
	            };
	            oXhr.send();
            },
			
			getRawComposition: function(aRawData, fnSuccess, fnError) {
				let sFilter = Commons.replaceParameters(Constants.FILTER_WHEREUSE_RAWCOMPOSITION, aRawData);

				let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};

				this.getModel().read(Constants.ENTITY_COMPOSITION, oServiceInfo);
			},
			
			getTpmFormulas: function(aRawData, fnSuccess, fnError) {
				let sFilter = Commons.replaceParameters(Constants.FILTER_TPM, aRawData);
				
				let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};

				this.getModel().read(Constants.ENTITY_INGREDIENTS, oServiceInfo);
			},
			
			getStandardFormulas: function(aRawData, fnSuccess, fnError) {
				let sFilter = Commons.replaceParameters(Constants.FILTER_INGREDIENTS, aRawData);
				
				let oServiceInfo = {
					urlParameters: {
						"$filter": sFilter
					},
					success: (oData) => {
						if (fnSuccess) {
							fnSuccess(oData);
						}
					},
					error: (oError) => {
						if (fnError) {
							fnError(oError);
						}
					}
				};

				this.getModel().read(Constants.ENTITY_STANDARD, oServiceInfo);
			},
		};
	}, true);
