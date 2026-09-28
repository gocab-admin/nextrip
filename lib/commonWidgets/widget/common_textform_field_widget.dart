import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../utils/utils.dart';

class CommonTextFromField extends StatefulWidget {
  final TextEditingController? controller;
  final String? hintText;
  final String? labelText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onFieldSubmitted;
  final List<TextInputFormatter>? inputFormatters;
  final FormFieldValidator<String>? validator;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool? enabled;
  final Color? fillColor;
  final EdgeInsetsGeometry? contentPadding;
  final TextInputType? keyboardType;
  final bool? obscureText;
  final Widget? suffix;
  final int? maxLines;
  final int? maxLength;
  final double? height;
  final double? width;
  final bool? autofocus;
  final Function()? onTap;
  final bool? filled;
  final BoxBorder? border;
  final TextStyle? hintStyle;
  final TextStyle? textStyle;
  final bool? expands;
  final bool? showCursor;
  final BorderRadiusGeometry? borderRadius;
  final FocusNode? focusNode;
  final String errorMessage;
  final bool readOnly;
  final TextAlignVertical? textAlignVertical;
  final TextAlign? textAlign;

  const CommonTextFromField(
      {super.key,
      this.controller,
      this.hintText,
      this.labelText,
      this.onChanged,
      this.suffix,
      this.validator,
      this.inputFormatters,
      this.prefixIcon,
      this.suffixIcon,
      this.enabled,
      this.fillColor,
      this.contentPadding,
      this.keyboardType,
      this.obscureText = false,
      Function(dynamic newValue)? onSaved,
      this.maxLines = 1,
      this.maxLength,
      this.height,
      this.width,
      this.onFieldSubmitted,
      this.autofocus = false,
      this.onTap,
      this.filled,
      this.showCursor,
      this.border,
      this.hintStyle,
      this.textStyle,
      this.expands = false,
      this.borderRadius,
      this.focusNode,
      this.errorMessage = "",
      this.readOnly = false, this.textAlignVertical, this.textAlign});

  @override
  State<CommonTextFromField> createState() => _CommonTextFromFieldState();
}

// final List<String> errors = [];

class _CommonTextFromFieldState extends State<CommonTextFromField> {
  // final _formKey = GlobalKey<FormState>();

  // void initState() {
  //   if (widget.controller != null) {
  //     widget.controller!.addListener(() {
  //       if (_formKey.currentState != null) {
  //         _formKey.currentState!.validate();
  //       }
  //     });
  //   }
  //   super.initState();
  // }

  // void removeError({required String error}) {
  //   if (errors.contains(error)) {
  //     setState(() {
  //       errors.remove(error);
  //     });
  //   }
  // }

  // void addError({required String error}) {
  //   if (!errors.contains(error)) {
  //     setState(() {
  //       errors.add(error);
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnimatedContainer(
          duration: Duration(milliseconds: 200),
          height: widget.height ?? 60,
          //MediaQuery.of(context).size.height * 0.09,
          width: widget.width,
          //padding: EdgeInsets.only(left: 10),
          decoration: BoxDecoration(
              color: widget.fillColor,
              border: widget.border,
              borderRadius: widget.borderRadius ??
                  const BorderRadius.all(Radius.circular(10))),
          child: Center(
            child: ClipRRect(
              borderRadius: widget.borderRadius ?? BorderRadius.circular(10),
              child: TextFormField(
                  expands: widget.expands ?? false,
                  onTap: widget.onTap,
                  readOnly: widget.readOnly,
                  focusNode: widget.focusNode,
                  autofocus: widget.autofocus ?? false,
                  showCursor: widget.showCursor ?? true,
                  cursorColor: AppColorData.appPrimaryColor,
                  enabled: widget.enabled,
                  controller: widget.controller,
                  //  controller: widget.controller,
                  inputFormatters: widget.inputFormatters,
                  keyboardType: widget.keyboardType,
                  obscureText: widget.obscureText!,
                  maxLines: widget.maxLines,
                  maxLength: widget.maxLength,
                  style: widget.textStyle ??
                      TextStyle(
                        fontSize: 16,
                        color: AppColorData.bodyTextColor,
                        fontWeight: FontWeight.w400,
                      ),
                  onChanged: widget.onChanged,
                  onFieldSubmitted: widget.onFieldSubmitted,
            
                  /*validator: (value) {
                    return widget.validator!(value);
                    },*/
                  validator: widget.validator,
                  textAlignVertical: widget.textAlignVertical,
                  textAlign: widget.textAlign ?? TextAlign.start,
                  decoration: InputDecoration(
                      filled: widget.filled,
                      fillColor: widget.fillColor,
                      focusColor: AppColorData.appSecondaryColor,
                      prefixIcon: widget.prefixIcon,
                      isDense: true,
                      prefixIconConstraints: BoxConstraints(
                        minWidth: 35,
                      ),
                      // prefix: widget.prefixIcon,
                      prefixIconColor: AppColorData.TfIconClr,
                      suffixIcon: widget.suffixIcon,
                      suffix: widget.suffix,
                      suffixIconColor: AppColorData.TfIconClr,
                      contentPadding: widget.contentPadding,
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      /*border: OutlineInputBorder(
                   borderSide:
                   BorderSide(color: AppColorData.grey, width: 1),
                   borderRadius: BorderRadius.circular(10),
                 ),
                 enabledBorder: OutlineInputBorder(
                   borderSide:
                   BorderSide(color: AppColorData.appPrimaryColor, width: 1),
                   borderRadius: BorderRadius.circular(10),
                 ),
                 focusedBorder: OutlineInputBorder(
                   borderSide:
                   BorderSide(color: AppColorData.appPrimaryColor, width: 1),
                   borderRadius: BorderRadius.circular(10),
                 ),*/
                      hintText: widget.hintText,
                      hintStyle: widget.hintStyle ??
                          TextStyle(
                            color: AppColorData.subBodyTextClr,
                            fontSize: 16,
                            fontWeight: FontWeight.w400,
                          ),
                      labelText: widget.labelText,
                      labelStyle: TextStyle(
                          color: AppColorData.subBodyTextClr,
                          fontWeight: FontWeight.w400,
                          fontSize: 16))),
            ),
          ),
        ),
        if (widget.errorMessage.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 3),
            child: Text(
              widget.errorMessage,
              style: AppTextStyle.contentStyle
                  .copyWith(color: AppColorData.errorColor),
            ),
          )
      ],
    );
  }
}
