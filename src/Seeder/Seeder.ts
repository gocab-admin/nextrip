import Admin from '@abserve/Module/Auth/Model/Admin'; 
import AdminRole from '@abserve/Module/Auth/Model/AdminRole';
import PropertyCategories from '@abserve/Module/Listing/Model/PropertyCategories';
import Properties from '@abserve/Module/Listing/Model/Properties';
import Privileges from '@abserve/Module/Privileges/Model/Privileges';
import PrivilegeCategories from '@abserve/Module/Privileges/Model/PrivilegeCategories';
import PrivilegeItems from '@abserve/Module/Privileges/Model/PrivilegeItems';
import { permissions } from '@abserve/Config/Permissions'
import { BaseModel } from '@abserve/Module/BaseModel';
import crypto from 'crypto';

export const createDefaultAdmin = async () => {
  try {
    let role = await AdminRole.findOne({ role: 'Super Admin' });
    if (!role) {
      role = await AdminRole.create({
        role: 'Super Admin',
        description: 'Default Super Admin with full permissions',
        permission: permissions.menusList.map(menu => ({
          ...menu,
          status: true,
          subMenuList: (menu.subMenuList || []).map(sub => ({ ...sub, status: true }))
        }))
      });
      console.log('Default Super Admin role created');
    }

    let admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      
      const newPassword = new BaseModel();
      const { salt, hash } = newPassword.setPassword('123456');

      await Admin.create({
        firstname: 'Admin',
        lastname: 'Test',
        email: 'admin@gmail.com',
        phone: '9876543210',
        role: role._id,
        salt: salt,
        hash: hash,
        verified: true,
        isActive: true
      });

      console.log('Default admin user created');
    }
  } catch (err) {
    console.error('Error creating default admin and role:', err);
  }
};

export const createDefaultCategory = async () => {
  try {
    let hotelCategory = await PropertyCategories.findOne({ category: 'Hotel' });
    if (!hotelCategory) {
      hotelCategory = await PropertyCategories.create({
        category: 'Hotel',
        icon: 'public/category/default-icon.png'
      });
      console.log('Category created');
    }

    const existingProperty = await Properties.findOne({
      property: 'An Entire Place',
      categoryId: hotelCategory._id
    });

    if (!existingProperty) {
      await Properties.create({
        property: 'An Entire Place',
        icon: 'public/icon/default-icon.png', 
        desc: 'You’ll have the whole place to yourself',
        categoryId: hotelCategory._id
      });
      console.log('Property created');
    }

  } catch (err) {
    console.error('Error creating default Hotel category or property', err);
  }
};

export const createDefaultPrivilege = async () => {
  try {
    let privileges = await Privileges.findOne({ name: 'Amenities' });
    if (!privileges) {
      privileges = await Privileges.create({
        name: 'Amenities',
        description: 'Amenities for you'
      });
      console.log('Privileges created');
    }

    let privilegeCategory = await PrivilegeCategories.findOne({
      name: 'Internet',
      privilegeId: privileges._id
    });

    if (!privilegeCategory) {
     privilegeCategory =  await PrivilegeCategories.create({
        name: 'Internet', 
        description: 'Internet Amenities',
        privilegeId: privileges._id
      });
      console.log('Privilege Category created');
    }
      let privilegeItems = await PrivilegeItems.findOne({
      name: 'Wifi',
      privilegeId: privileges._id,
      privilegeCategoryId: privilegeCategory._id

    });
    
    if (!privilegeItems) {
      privilegeItems = await PrivilegeItems.create({
        name: 'Wifi', 
        description: 'Wifi for you',
        privilegeId: privileges._id,
        privilegeCategoryId: privilegeCategory._id,
        icon: 'public/icon/Wifi.png'
      });
      console.log('Privilege Item created');
    }

  } catch (err) {
    console.error('Error creating default Privilege datas', err);
  }
};