import { AppFilter, AppFilterProps } from "./AppFilter";

export enum ObjectFilterTabs {
  ObjectTable = "object-table",
  ObjectForm = "object-form",
  ObjectView = "object-view",
  ObjectProductsForm = "object-products-form",
  ObjectProducts = "object-products",
  ObjectOnView = "object-view-on",
  ObjectPdfReport = "object-pdf-report",
}

export enum ProductFormTypes {
  WithObjectForm = "1",
  WithOutObjectForm = "2",
}

export enum ObjectFormTypes {
  WithProductForm = "1",
  WithoutProductForm = "2",
}

export enum ObjectProductsPageTypes {
  Form = "1",
  Table = "2",
}

interface ObjectFilterProps extends AppFilterProps<ObjectFilterTabs> {
  readonly createdBy?: string;
  readonly objectId?: string;
  readonly product?: string;
  readonly productId?: string;
  readonly formType?: string;
  readonly productFormType?: ProductFormTypes;
  readonly objectFormType?: ObjectFormTypes;
  readonly productPageType?: ObjectProductsPageTypes;

  readonly regionId: string;
  readonly districtId: string;
  readonly streetId: string;
  readonly projectId: string;
  readonly numberOfOrderId: string;
  readonly objectClassificationId: string;
  readonly objectClassificationTypeId: string;
  readonly searchValue: string;
  readonly region: string;
  readonly district: string;
  readonly street: string;
  readonly project: string;
  readonly order: string;
  readonly classType: string;
  readonly class: string;
}

export class ObjectFilter extends AppFilter<ObjectFilterTabs> {
  private readonly objectId: string;
  private readonly product: string;
  private readonly productId: string;
  private readonly formType: string;
  private readonly productFormType: ProductFormTypes;
  private readonly objectFormType: ObjectFormTypes;
  private readonly productPageType: ObjectProductsPageTypes;
  private readonly regionId: string;
  private readonly districtId: string;
  private readonly streetId: string;
  private readonly projectId: string;
  private readonly numberOfOrderId: string;
  private readonly objectClassificationId: string;
  private readonly objectClassificationTypeId: string;
  private readonly searchValue: string;
  private readonly createdBy: string;
  // UI Filter state
  private readonly region: string;
  private readonly district: string;
  private readonly street: string;
  private readonly project: string;
  private readonly order: string;
  private readonly classType: string;
  private readonly class: string;

  public constructor(
    {
      objectId,
      product,
      productId,
      createdBy,
      formType,
      productFormType,
      productPageType,
      objectFormType,
      regionId,
      districtId,
      streetId,
      projectId,
      numberOfOrderId,
      objectClassificationId,
      objectClassificationTypeId,
      searchValue,
      // UI Filter state
      region,
      district,
      street,
      project,
      order,
      classType,
      class: classItem,
      ...props
    } = {} as ObjectFilterProps,
  ) {
    super({ ...props });
    this.objectId = objectId || "";
    this.product = product || "";
    this.productId = productId || "";
    this.formType = formType || "";
    this.productFormType = productFormType || ProductFormTypes.WithOutObjectForm;
    this.productPageType = productPageType || ObjectProductsPageTypes.Table;
    this.objectFormType = objectFormType || ObjectFormTypes.WithoutProductForm;
    this.createdBy = createdBy || "0";
    this.regionId = regionId || "0";
    this.districtId = districtId || "0";
    this.streetId = streetId || "0";
    this.projectId = projectId || "0";
    this.numberOfOrderId = numberOfOrderId || "0";
    this.objectClassificationId = objectClassificationId || "0";
    this.objectClassificationTypeId = objectClassificationTypeId || "0";
    this.searchValue = searchValue || "";
    // UI Filter state
    this.region = region || "0";
    this.district = district || "0";
    this.street = street || "0";
    this.project = project || "0";
    this.order = order || "0";
    this.classType = classType || "0";
    this.class = classItem || "0";
  }

  public getObyektId() {
    return this.objectId;
  }

  public getProduct() {
    return this.product;
  }

  public getProductId() {
    return this.productId;
  }

  public getFormType() {
    return this.formType;
  }

  public getProductFormType() {
    return this.productFormType;
  }

  public getOjbectFormType() {
    return this.objectFormType;
  }

  public getProductPageType() {
    return this.productPageType;
  }

  public getObjectFilter() {
    return {
      regionId: this.regionId,
      districtId: this.districtId,
      streetId: this.streetId,
      projectId: this.projectId,
      numberOfOrderId: this.numberOfOrderId,
      objectClassificationId: this.objectClassificationId,
      objectClassificationTypeId: this.objectClassificationTypeId,
      searchValue: this.searchValue,
      pageNumber: this.pageCount,
      pageSize: this.perPage,
      createdBy: this.createdBy,
    };
  }

  // UI Filter state getters
  public getRegion() {
    return this.region;
  }

  public getDistrict() {
    return this.district;
  }

  public getStreet() {
    return this.street;
  }

  public getProject() {
    return this.project;
  }

  public getOrder() {
    return this.order;
  }

  public getClassType() {
    return this.classType;
  }

  public getClass() {
    return this.class;
  }

  public getUiFilter() {
    return {
      region: this.region,
      district: this.district,
      street: this.street,
      project: this.project,
      order: this.order,
      classType: this.classType,
      class: this.class,
    };
  }
}
