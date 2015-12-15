import SnippodRawTheme from '../../theme/snippod-raw-theme-boilerplate';
const Colors = require('material-ui/lib/styles/colors');


const Styles = {
  loginDialog: {
    width: 256 + 24 * 2 + 8,
  },

  dialogBodyStyle: {
    paddingTop: '12',
  },

  //Material UI Component Style
  flatButton: {
    //hoverColor: SnippodRawTheme.palette.accent2Color,

    style: {
      color: Colors.white,
      backgroundColor: SnippodRawTheme.palette.primary1Color,
      textColor: Colors.white,
      fontWeight: 300,
    }
  },

  errorText: {
    init: {
      color: Colors.red500,
      fontSize: 12,
      textAlign: 'center',
      paddingRight: 12,
      transition: '1s',
      transitionDelay: '1s',
    },

    blur: {
      color: Colors.red200,
    }

  }

};

module.exports = Styles;