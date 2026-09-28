import 'dart:io';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:dio/dio.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;
import 'package:provider/provider.dart';

class EditProfile extends StatefulWidget {
  final UserResponseModel userModel;
  const EditProfile({super.key, required this.userModel});

  @override
  State<EditProfile> createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {
  File? _image;
  final picker = ImagePicker();

  Future getImage(ImageSource source) async {
    final pickedFile = await picker.pickImage(source: source);

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
        print("_image!.path:: ${_image!.path}");
      }
    });
    String fileName = path.basename(_image!.path);
    String mimeType = getMimeType(fileName);
    editProfileViewModel!.body["file"] = await MultipartFile.fromFile(
      _image!.path,
      filename: fileName,
      contentType: MediaType.parse(mimeType),
    );
    editProfileViewModel!.profileUpdate(onSuccess: () {});
  }

  EditProfileViewModel? editProfileViewModel;

  @override
  void initState() {
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);

    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      editProfileViewModel!.addProfileList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      body: Consumer<EditProfileViewModel>(builder: (context, value, child) {
        return _renderBody(value);
      }),
    );
  }

  Widget _renderBody(EditProfileViewModel model) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            child: Padding(
              padding: horizontalPadding(vertical: 14.0),
              child: Column(
                children: [
                  SizedBox(
                    height: 20,
                  ),
                  _profilePicture(model.userResponseModel?.data?.userDetail),
                  SizedBox(
                    height: 40,
                  ),
                  _profileDataList(model.userResponseModel?.data?.userDetail ??
                      widget.userModel.data!.userDetail),
                ],
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(14.0),
          child: CommonElevatedButton(
              showLoader: true,
              elevatedButtonColor: AppColorData.blackButtonClr,
              elevatedButtonName: "done",
              onTap: () {
                Navigator.pop(context);
              }),
        )
      ],
    );
  }

  Widget _profilePicture(UserDetail? details) {
    var data = details ?? widget.userModel.data?.userDetail;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Stack(
          alignment: Alignment.bottomCenter,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(100),
                child: Consumer<EditProfileViewModel>(
                    builder: (context, value, child) {
                  return Container(
                    width: 110,
                    height: 110,
                    child: value.state == ViewState.secondaryLoader
                        ? ProgressLoader()
                        : CacheImageWidget(
                            fit: BoxFit.cover,
                            imageUrl:
                                //  "${checkGoogleImageUrl(data?.profileImage ?? "")}",
                                data?.profileImage ?? "",
                            errorBuilder: (context, url, error) {
                              return ErrorImage();
                            },
                          ),
                  );
                }),
              ),
            ),
            GestureDetector(
              onTap: () {
                showCustomModalBottomSheet(
                    backgroundColor: AppColorData.appSecondaryColor,
                    // height: 0.3,
                    context: context,
                    builder: (context) {
                      return takePicture();
                    });
              },
              child: Container(
                height: 30,
                decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                          spreadRadius: 2,
                          blurRadius: 7,
                          color: Colors.grey.withOpacity(0.5))
                    ],
                    color: Colors.white,
                    border: Border.all(color: AppColorData.boxBorder),
                    borderRadius: BorderRadius.circular(7)),
                padding: EdgeInsets.symmetric(horizontal: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Icon(
                      Icons.camera_alt_rounded,
                      size: 18,
                    ),
                    SizedBox(
                      width: 8.0,
                    ),
                    CommonText(
                        text: data?.profileImage != null ? "edit" : "add"),
                  ],
                ),
              ),
            ),
          ],
        )
      ],
    );
  }

  Widget takePicture() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: () {
            getImage(ImageSource.gallery);
            Navigator.pop(context);
          },
          child: ListTile(
            title: CommonText(text: "selectfromDevice"),
            trailing: Icon(
              Icons.arrow_forward_ios_sharp,
              size: 20,
            ),
          ),
        ),
        GestureDetector(
          onTap: () {
            getImage(ImageSource.camera);
            Navigator.pop(context);
          },
          child: ListTile(
            title: CommonText(text: "takeAPhoto"),
            trailing: Icon(Icons.arrow_forward_ios_sharp, size: 20),
          ),
        )
      ],
    );
  }

  Widget _profileDataList(UserDetail? details) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "yourProfile",
          style: AppTextStyle.titleStyle,
        ),
        spacer(),
        RichText(
          softWrap: true,
          text: TextSpan(
              text:
                  tr("yourProfileSub", namedArgs: {"appName": Strings.appName}),
              style: AppTextStyle.bodyTextStyle.copyWith(
                  wordSpacing: 3,
                  fontWeight: FontWeight.w100,
                  color: AppColorData.bodyTextColor.withOpacity(0.8)),
              children: [
                // TextSpan(
                //     text: tr("learnMore"),
                //     style: AppTextStyle.bodyTextStyle.copyWith(
                //         fontWeight: FontWeight.w600,
                //         decoration: TextDecoration.underline)),
              ]),
        ),
        doubleSpacer(),
        ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: editProfileViewModel?.profileList.length,
            itemBuilder: (context, index) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    onTap: () {
                      _showBottomSheet(
                          context: context,
                          profile: editProfileViewModel!.profileList[index],
                          details: details);
                    },
                    trailing: editProfileViewModel!
                            .profileList[index].controller.text.isNotEmpty
                        ? Icon(Icons.arrow_forward_ios, size: 20)
                        : null,
                    leading: Container(
                        child: SvgPicture.asset(
                      editProfileViewModel!.profileList[index].icon,
                      height: 20,
                      width: 20,
                    )),
                    title: CommonText(
                      text:
                          "${editProfileViewModel?.profileList[index].info.tr()}${editProfileViewModel!.profileList[index].controller.text.isNotEmpty ? ': ${editProfileViewModel!.profileList[index].controller.text}' : ''}",
                      style: editProfileViewModel!
                              .profileList[index].controller.text.isNotEmpty
                          ? AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.w400)
                          : AppTextStyle.bodyTextStyle.copyWith(
                              fontWeight: FontWeight.w400,
                              color: AppColorData.subBodyTextClr),
                    ),
                  ),
                  divider(
                    height: 17,
                    color: AppColorData.dividerColor,
                    thickness: 2,
                  ),
                ],
              );
            }),
      ],
    );
  }

  // void _showBottomSheet(BuildContext context, ProfileList profile) {
  //   showCustomModalBottomSheet(
  //       backgroundColor: AppColorData.appSecondaryColor,
  //       context: context,
  //       builder: (context) {
  //         return AnimatedContainer(
  //           duration: Duration(milliseconds: 300),
  //           padding: EdgeInsets.all(16.0),
  //           child: _buildBottomSheetContent(profile: profile),
  //         );
  //       });
  // }

  void _showBottomSheet(
      {required BuildContext context,
      required ProfileList profile,
      UserDetail? details}) {
    final TextEditingController controller =
        TextEditingController(text: profile.controller.text);
    editProfileViewModel!.initializeController(controller);
    showCustomModalBottomSheet(
      context: context, showDivider: false, // isScrollControlled: true,
      backgroundColor: AppColorData.appSecondaryColor,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 14,
            right: 14,
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: _buildBottomSheetContent(
              profile: profile, details: details, controller: controller),
        );
      },
    );
  }

  Widget _buildBottomSheetContent(
      {required ProfileList profile,
      UserDetail? details,
      required TextEditingController controller}) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Row(
        //   children: [
        //     IconButton(onPressed: (){
        //       Navigator.pop(context);
        //     }, icon: Icon(Icons.close)),
        //   ],
        // ),
        // Divider(),
        CommonText(
          text: profile.info,
          style: AppTextStyle.titleStyle,
        ),
        SizedBox(height: 10),
        CommonText(
          text: "detailsBelow",
          style: AppTextStyle.bodyTextStyle
              .copyWith(fontWeight: FontWeight.w400), //TextStyle(fontSize: 16),
        ),
        SizedBox(height: 10),
        CommonTextFromField(
          contentPadding: EdgeInsets.symmetric(horizontal: 10),
          autofocus: true,
          controller: controller,
          // onChanged: (val) {
          //   editProfileViewModel!.TextFieldChangeVal(val);
          // },
          labelText: tr(profile.info),
          border: Border.all(color: AppColorData.blackBorderClr),
        ),

        SizedBox(
          height: 40,
        ),
        CustomDivider(),
        spacer(),
        Align(
          alignment: Alignment.bottomCenter,
          child: Consumer<EditProfileViewModel>(
              builder: (context, viewModel, child) {
            return CommonElevatedButton(
                showLoader: true,
                isLoad:
                    viewModel.state == ViewState.secondaryLoader ? true : false,
                elevatedButtonColor: AppColorData.blackButtonClr,
                elevatedButtonName: "save",
                onTap: () {
                  (controller.text.isNotEmpty)
                      ? viewModel.body["${profile.value}"] =
                          controller.text.trim()
                      : null;
                  Logger.appLogs(">>>> ${viewModel.body}");
                  viewModel.profileUpdate(onSuccess: () {
                    if (context.mounted) {
                      Navigator.pop(context);
                      ToastUtil.showMessage(
                          viewModel.profileUpdateResponseModel?.message ?? '');
                    }
                  });
                });
          }),
        ),
        SizedBox(
          height: 30,
        ),
      ],
    );
  }
}
