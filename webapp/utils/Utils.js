sap.ui.define(
  [
    "apptorparameters/utils/Constants",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/MessageToast"
  ],
  function (
    Constants,
    Filter,
    FilterOperator,
    MessagePopover,
    MessageItem,
    MessageToast
  ) {
    "use strict";
    return {
      /**
       *
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       * @param {string} FragmentName - Fragment name string
       * @returns {object} Returns a fragment
       */
      _getCreateFragmentValueHelp: function (oEvent, FragmentName) {
        if (
          oEvent.getId() == Constants.parametersOEvent.CHANGE ||
          oEvent.getId() == Constants.parametersOEvent.VALUEHELPREQUEST
        ) {
          this.inputID = oEvent.getSource();
        } else {
          this.inputID = oEvent;
        }
        // create dialog lazily
        if (!this[FragmentName]) {
          // create dialog via fragment factory
          this[FragmentName] = sap.ui.xmlfragment(
            "apptorparameters.view.fragment." + FragmentName,
            this
          );
          // connect dialog to view (models, lifecycle)
          this.getView().addDependent(this[FragmentName]);
        }
        return this[FragmentName];
      },

      /**
       * It is used to set the value of the inputs in the valuehelp
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      simpleSetValueHelpFilters: function (oEvent) {
        let bindingInfoTitle = oEvent
          .getSource()
          .getAggregation(Constants.parametersOEvent.DIALOG)
          .getContent()[1]
          .getBindingInfo(Constants.parametersOEvent.ITEMS)
          .template.getBindingInfo(Constants.parametersOEvent.TITLE)[
          Constants.parametersOEvent.PARTS
        ][0].path;
        let sInputValue = oEvent.getParameter(Constants.parametersOEvent.VALUE);
        let oDialog = oEvent.getSource();
        let oFilterTitle = new Filter({
          path: bindingInfoTitle,
          operator: FilterOperator.Contains,
          value1: sInputValue,
          caseSensitive: false
        });
        oDialog
          .getBinding(Constants.parametersOEvent.ITEMS)
          .filter(new Filter([oFilterTitle], false));
      },

      /**
       * It is used to set the value of the inputs in the valuehelp
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      setValueHelpFilters: function (oEvent) {
        let bindingInfoTitle = oEvent
          .getSource()
          .getAggregation(Constants.parametersOEvent.DIALOG)
          .getContent()[1]
          .getBindingInfo(Constants.parametersOEvent.ITEMS)
          .template.getBindingInfo(Constants.parametersOEvent.TITLE)[
          Constants.parametersOEvent.PARTS
        ][0].path;
        let bindingInfoDescription = oEvent
          .getSource()
          .getAggregation(Constants.parametersOEvent.DIALOG)
          .getContent()[1]
          .getBindingInfo(Constants.parametersOEvent.ITEMS)
          .template.getBindingInfo(Constants.parametersOEvent.DESCRIPTION)[
          Constants.parametersOEvent.PARTS
        ][0][Constants.parametersOEvent.PATH];
        let sInputValue = oEvent.getParameter(Constants.parametersOEvent.VALUE);
        let oDialog = oEvent.getSource();
        let oFilterDesc = new Filter({
          path: bindingInfoDescription,
          operator: FilterOperator.Contains,
          value1: sInputValue,
          caseSensitive: false
        });
        let oFilterTitle = new Filter({
          path: bindingInfoTitle,
          operator: FilterOperator.Contains,
          value1: sInputValue,
          caseSensitive: false
        });
        oDialog
          .getBinding(Constants.parametersOEvent.ITEMS)
          .filter(new Filter([oFilterDesc, oFilterTitle], false));
      },

      /**
       * used to close the dialog
       * @param {object} oEvent - This object contains relevant information about the event that ocurred, such as the event type, the control that triggered the event, and any additional data associated
       */
      onDialogCloseDialogs: function (oEvent) {
        let oSelectedItem = oEvent.getParameter(
          Constants.parametersOEvent.SELECTED_ITEM
        );
        if (oSelectedItem) {
          let shipIn = this.inputID;
          shipIn.setValue(
            oSelectedItem.getBindingInfo(Constants.parametersOEvent.DESCRIPTION)
              ? oSelectedItem.getDescription()
              : oSelectedItem.getTitle()
          );
          shipIn.fireChange();
        }
        oEvent
          .getSource()
          .getBinding(Constants.parametersOEvent.ITEMS)
          .filter([]);
      },

      /**
       * Iterates over the messages in the message model and determines the highest severity icon based on certain rules.
       * Constants defined in Constants are used to represent the different types of icons, such as ERROR, ALERT, SYS_ENTER_2, and INFORMATION.
       * The end result is the highest severity icon type, which is then used in other parts of the application to set the corresponding icons.
       * @param {ThisParameterType} context - Controller context
       * @returns {string} Returns a constant string icon for standard states "Error, Warning and Success"
       */
      buttonIconFormatter: function (context) {
        let sIcon;
        let aMessages = context
          .getView()
          .getModel(Constants.model.MESSAGE_MODEL).oData;
        aMessages.forEach(function (sMessage) {
          switch (sMessage.type) {
            case Constants.state.ERROR:
              sIcon = Constants.icon.ERROR;
              break;
            case Constants.state.WARNING:
              sIcon =
                sIcon !== Constants.icon.ERROR ? Constants.icon.ALERT : sIcon;
              break;
            case Constants.state.SUCCESS:
              sIcon =
                sIcon !== Constants.icon.ERROR && sIcon !== Constants.icon.ALERT
                  ? Constants.icon.SYS_ENTER_2
                  : sIcon;
              break;
            default:
              sIcon = !sIcon ? Constants.icon.INFORMATION : sIcon;
              break;
          }
        });
        return sIcon;
      },

      /**
       * The function iterates over the messages in the message model and determines the highest severity icon type based on certain rules.
       * Constants defined in Constants are used to represent the different severity states, such as ERROR, WARNING, SUCCESS, and NEUTRAL.
       * The end result is the highest gravity type of icon, which is then used in other parts of the application to style the corresponding elements.
       * @param {ThisParameterType} context - Controller context
       * @returns {string} Returns a constant string for standard states "Error, Warning and Success"
       */
      buttonTypeFormatter: function (context) {
        let sHighestSeverityIcon;
        let aMessages = context
          .getView()
          .getModel(Constants.model.MESSAGE_MODEL).oData;
        aMessages.forEach(function (sMessage) {
          switch (sMessage.type) {
            case Constants.state.ERROR:
              sHighestSeverityIcon = Constants.state.NEGATIVE;
              break;
            case Constants.state.WARNING:
              sHighestSeverityIcon =
                sHighestSeverityIcon !== Constants.state.NEGATIVE
                  ? Constants.state.CRITICAL
                  : sHighestSeverityIcon;
              break;
            case Constants.state.SUCCESS:
              sHighestSeverityIcon =
                sHighestSeverityIcon !== Constants.state.NEGATIVE &&
                sHighestSeverityIcon !== Constants.state.CRITICAL
                  ? Constants.state.SUCCESS
                  : sHighestSeverityIcon;
              break;
            default:
              sHighestSeverityIcon = !sHighestSeverityIcon
                ? Constants.state.NEUTRAL
                : sHighestSeverityIcon;
              break;
          }
        });
        return sHighestSeverityIcon;
      },

      /**
       * The function determines the highest severity message type based on the icon type and then counts how many messages in the model have that message type.
       * The result is the number of messages with the highest severity.
       * @param {ThisParameterType} context - Controller context
       * @returns {string} Returns Popover messages number count
       */
      highestSeverityMessages: function (context) {
        let sHighestSeverityIconType = this.buttonTypeFormatter(context);
        let sHighestSeverityMessageType;
        switch (sHighestSeverityIconType) {
          case Constants.state.NEGATIVE:
            sHighestSeverityMessageType = Constants.state.ERROR;
            break;
          case Constants.state.CRITICAL:
            sHighestSeverityMessageType = Constants.state.WARNING;
            break;
          case Constants.state.SUCCESS:
            sHighestSeverityMessageType = Constants.state.SUCCESS;
            break;
          default:
            sHighestSeverityMessageType = !sHighestSeverityMessageType
              ? Constants.state.INFORMATION
              : sHighestSeverityMessageType;
            break;
        }
        return context
          .getView()
          .getModel(Constants.model.MESSAGE_MODEL)
          .oData.reduce(function (iNumberOfMessages, oMessageItem) {
            return oMessageItem.type === sHighestSeverityMessageType
              ? ++iNumberOfMessages
              : iNumberOfMessages;
          }, 0);
      },

      /**
       * that function set the pop over
       * @param {object} popover - Popover properties object
       */
      setPopover: function (popover) {
        this.popover = popover;
      },

      /**
       * that function get the pop over
       * @returns {string} Returns Popover properties object instanciate in controller context
       */
      getPopover: function () {
        return this.popover;
      },

      /**
       * create a pop over
       * @param {ThisParameterType} context - Controller context
       * @param {string} Id - String id popover to create
       */
      createPopover: function (context, Id) {
        let oMessageTemplate = new MessageItem({
          type: Constants.messageModel.TYPE,
          title: Constants.messageModel.TITLE,
          activeTitle: Constants.messageModel.ACTIVETITLE,
          description: Constants.messageModel.DESCRIPTION,
          subtitle: Constants.messageModel.SUBTITLE,
          link: ""
        });
        if (!this.getPopover()) {
          let oMessagePopover = new MessagePopover({
            items: {
              path: Constants.messageModel.PATH,
              template: oMessageTemplate
            },
            activeTitlePress: function () {
              MessageToast.show(
                context
                  .getView()
                  .getModel(Constants.model.I18N_MODEL)
                  .getResourceBundle()
                  .getText("service.activePressed")
              );
            }
          });
          this.setPopover(oMessagePopover);
        }
        let messagePopOver = context.byId(Id);
        messagePopOver.addDependent(this.getPopover());
        messagePopOver.setType(this.buttonTypeFormatter(context));
        messagePopOver.setIcon(this.buttonIconFormatter(context));
        messagePopOver.setText(this.highestSeverityMessages(context));
        messagePopOver.attachPress((oEvent) => {
          this.getPopover().openBy(oEvent.getSource());
        });
        this.getPopover()
          .getBinding(Constants.parametersOEvent.ITEMS)
          .attachChange(() => {
            messagePopOver.setType(this.buttonTypeFormatter(context));
            messagePopOver.setIcon(this.buttonIconFormatter(context));
            messagePopOver.setText(this.highestSeverityMessages(context));
          });
      },

      /**
       * This function retrieves the error message that returns backend when a service returns error.
       * @param {ThisParameterType} context - Controller context
       * @param {context}	type	"Information" / "Warning" / "Success" / "Error", it also needs an i18n counterpart for Translations
       * @param {context}	message	String thats showed to the user
       * @returns {object} Message of object for the Message Popover control
       */
      returnMessage: function (context, type, message) {
        return {
          type: type,
          title: context
            .getView()
            .getModel(Constants.model.I18N_MODEL)
            .getResourceBundle()
            .getText(type.toLowerCase()),
          description: message,
          subtitle: message.substring(0, 40),
          counter: 1
        };
      }
    };
  }
);
