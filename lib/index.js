import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
} from "react-native-country-picker-modal";
import { PhoneNumberUtil } from "google-libphonenumber";
import styles from "./styles";

const dropDown =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==";
const phoneUtil = PhoneNumberUtil.getInstance();

export default class PhoneInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      code: props.defaultCode ? undefined : "91",
      number: props.value
        ? props.value
        : props.defaultValue
        ? props.defaultValue
        : "",
      modalVisible: false,
      countryCode: props.defaultCode ? props.defaultCode : "IN",
      disabled: props.disabled || false,
      excludedCountries: props.excludedCountries || ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.disabled !== prevState.disabled) {
      if ((nextProps.value || nextProps.value === "") && nextProps.value !== prevState.number) {
        return ({ disabled: nextProps.disabled, number: nextProps.value });
      }
      return ({ disabled: nextProps.disabled });
    }
    return null;
  };

  async componentDidMount() {
    const { defaultCode } = this.props;
    if (defaultCode) {
      const code = await getCallingCode(defaultCode);
      this.setState({ code });
    }
  }

  getCountryCode = () => {
    return this.state.countryCode;
  };

  getCallingCode = () => {
    return this.state.code;
  };

  isValidNumber = (number) => {
    try {
      const { countryCode } = this.state;
      const parsedNumber = phoneUtil.parse(number, countryCode);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
      return false;
    }
  };

  onSelect = (country) => {
    const { onChangeCountry } = this.props;
    this.setState(
      {
        countryCode: country.cca2,
        code: country.callingCode[0],
      },
      () => {
        const { onChangeFormattedText } = this.props;
        if (onChangeFormattedText) {
          if (country.callingCode[0]) {
            onChangeFormattedText(
              `+${country.callingCode[0]}${this.state.number}`
            );
          } else {
            onChangeFormattedText(this.state.number);
          }
        }
      }
    );
    if (onChangeCountry) {
      onChangeCountry(country);
    }
  };

  onChangeText = (text) => {
    this.setState({ number: text });
    const { onChangeText, onChangeFormattedText } = this.props;
    if (onChangeText) {
      onChangeText(text);
    }
    if (onChangeFormattedText) {
      const { code } = this.state;
      if (code) {
        onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
      } else {
        onChangeFormattedText(text);
      }
    }
  };

  getNumberAfterPossiblyEliminatingZero() {
    let { number, code } = this.state;
    if (number.length > 0 && number.startsWith("0")) {
      number = number.substr(1);
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    } else {
      return { number, formattedNumber: code ? `+${code}${number}` : number };
    }
  }

  renderDropdownImage = () => {
    return (
      <Image
        source={{ uri: dropDown }}
        resizeMode="contain"
        style={styles.dropDownImage}
      />
    );
  };

  renderFlagButton = (props) => {
    const { layout = "first", flagSize } = this.props;
    const { countryCode } = this.state;
    if (layout === "first") {
      return (
        <Flag
          countryCode={countryCode}
          flagSize={flagSize ? flagSize : DEFAULT_THEME.flagSize}
        />
      );
    }
    return <View />;
  };

  render() {
    const {
      withShadow,
      withDarkTheme,
      codeTextStyle,
      textInputProps,
      textInputStyle,
      autoFocus,
      placeholder,
      disableArrowIcon,
      flagButtonStyle,
      containerStyle,
      textContainerStyle,
      renderDropdownImage,
      countryPickerProps = {},
      filterProps = {},
      countryPickerButtonStyle,
      layout = "first",
    } = this.props;
    const { modalVisible, code, countryCode, number, disabled } = this.state;
    return (
      <CountryModalProvider>
        <View
          style={[
            styles.container,
            withShadow ? styles.shadow : {},
            containerStyle ? containerStyle : {},
          ]}
        >
          <TouchableOpacity
            style={[
              styles.flagButtonView,
              layout === "second" ? styles.flagButtonExtraWidth : {},
              flagButtonStyle ? flagButtonStyle : {},
              countryPickerButtonStyle ? countryPickerButtonStyle : {},
            ]}
            disabled={disabled}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <CountryPicker
              onSelect={this.onSelect}
              withEmoji
              withFilter
              withFlag
              filterProps={filterProps}
              countryCode={countryCode}
              withCallingCode
              disableNativeModal={disabled}
              excludeCountries={this.state.excludedCountries}
              visible={modalVisible}
              theme={withDarkTheme ? DARK_THEME : DEFAULT_THEME}
              renderFlagButton={this.renderFlagButton}
              onClose={() => this.setState({ modalVisible: false })}
              {...countryPickerProps}
            />
            {code && layout === "second" && (
              <Text
                style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}
              >{`+${code}`}</Text>
            )}
            {!disableArrowIcon && (
              <React.Fragment>
                {renderDropdownImage
                  ? renderDropdownImage
                  : this.renderDropdownImage()}
              </React.Fragment>
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.textContainer,
              textContainerStyle ? textContainerStyle : {},
            ]}
          >
            {code && layout === "first" && (
              <Text
                style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}
              >{`+${code}`}</Text>
            )}
            <TextInput
              style={[styles.numberText, textInputStyle ? textInputStyle : {}]}
              placeholder={placeholder ? placeholder : "Phone Number"}
              onChangeText={this.onChangeText}
              value={number}
              editable={disabled ? false : true}
              selectionColor="black"
              keyboardAppearance={withDarkTheme ? "dark" : "default"}
              keyboardType="number-pad"
              autoFocus={autoFocus}
              {...textInputProps}
            />
          </View>
        </View>
      </CountryModalProvider>
    );
  }
}

export const isValidNumber = (number, countryCode) => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
};