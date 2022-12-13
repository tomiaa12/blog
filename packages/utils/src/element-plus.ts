import { DefineComponent } from "vue"
import {
  ElAffix,
  ElAlert,
  ElAutocomplete,
  ElAutoResizer,
  ElAvatar,
  ElBacktop,
  ElBadge,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElButtonGroup,
  ElCalendar,
  ElCard,
  ElCarousel,
  ElCarouselItem,
  ElCascader,
  ElCascaderPanel,
  ElCheckTag,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElConfigProvider,
  ElContainer,
  ElAside,
  ElFooter,
  ElHeader,
  ElMain,
  ElDatePicker,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDivider,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElIcon,
  ElImage,
  ElImageViewer,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElPageHeader,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElPopper,
  ElProgress,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElResult,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElSelectV2,
  ElSkeleton,
  ElSkeletonItem,
  ElSlider,
  ElSpace,
  ElSteps,
  ElStep,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTableV2,
  ElTabs,
  ElTabPane,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTimeline,
  ElTimelineItem,
  ElTooltip,
  ElTransfer,
  ElTree,
  ElTreeSelect,
  ElTreeV2,
  ElUpload,
  FormItemRule,
} from "element-plus"

// 去除 DefineComponent 不需要的属性
type OmitBaseProps<T> = Omit<T, keyof InstanceType<DefineComponent>["$props"]>

// 继承并设为可选值
type Pick<T> = {
  [P in keyof OmitBaseProps<T>]?: any
}

// element plus 组件事件
type ElAttrs = Pick<InstanceType<typeof ElAffix>["$props"]> &
  Pick<InstanceType<typeof ElAlert>["$props"]> &
  Pick<InstanceType<typeof ElAutocomplete>["$props"]> &
  Pick<InstanceType<typeof ElAutoResizer>["$props"]> &
  Pick<InstanceType<typeof ElAvatar>["$props"]> &
  Pick<InstanceType<typeof ElBacktop>["$props"]> &
  Pick<InstanceType<typeof ElBadge>["$props"]> &
  Pick<InstanceType<typeof ElBreadcrumb>["$props"]> &
  Pick<InstanceType<typeof ElBreadcrumbItem>["$props"]> &
  Pick<InstanceType<typeof ElButton>["$props"]> &
  Pick<InstanceType<typeof ElButtonGroup>["$props"]> &
  Pick<InstanceType<typeof ElCalendar>["$props"]> &
  Pick<InstanceType<typeof ElCard>["$props"]> &
  Pick<InstanceType<typeof ElCarousel>["$props"]> &
  Pick<InstanceType<typeof ElCarouselItem>["$props"]> &
  Pick<InstanceType<typeof ElCascader>["$props"]> &
  Pick<InstanceType<typeof ElCascaderPanel>["$props"]> &
  Pick<InstanceType<typeof ElCheckTag>["$props"]> &
  Pick<InstanceType<typeof ElCheckbox>["$props"]> &
  Pick<InstanceType<typeof ElCheckboxButton>["$props"]> &
  Pick<InstanceType<typeof ElCheckboxGroup>["$props"]> &
  Pick<InstanceType<typeof ElCol>["$props"]> &
  Pick<InstanceType<typeof ElCollapse>["$props"]> &
  Pick<InstanceType<typeof ElCollapseItem>["$props"]> &
  Pick<InstanceType<typeof ElCollapseTransition> & ["$props"]> &
  Pick<InstanceType<typeof ElColorPicker>["$props"]> &
  Pick<InstanceType<typeof ElConfigProvider>["$props"]> &
  Pick<InstanceType<typeof ElContainer>["$props"]> &
  Pick<InstanceType<typeof ElAside>["$props"]> &
  Pick<InstanceType<typeof ElFooter>["$props"]> &
  Pick<InstanceType<typeof ElHeader>["$props"]> &
  Pick<InstanceType<typeof ElMain>["$props"]> &
  Pick<InstanceType<typeof ElDatePicker>["$props"]> &
  Pick<InstanceType<typeof ElDescriptions>["$props"]> &
  Pick<InstanceType<typeof ElDescriptionsItem>["$props"]> &
  Pick<InstanceType<typeof ElDialog>["$props"]> &
  Pick<InstanceType<typeof ElDivider>["$props"]> &
  Pick<InstanceType<typeof ElDrawer>["$props"]> &
  Pick<InstanceType<typeof ElDropdown>["$props"]> &
  Pick<InstanceType<typeof ElDropdownItem>["$props"]> &
  Pick<InstanceType<typeof ElDropdownMenu>["$props"]> &
  Pick<InstanceType<typeof ElEmpty>["$props"]> &
  Pick<InstanceType<typeof ElForm>["$props"]> &
  Pick<InstanceType<typeof ElFormItem>["$props"]> &
  Pick<InstanceType<typeof ElIcon>["$props"]> &
  Pick<InstanceType<typeof ElImage>["$props"]> &
  Pick<InstanceType<typeof ElImageViewer>["$props"]> &
  Pick<InstanceType<typeof ElInput>["$props"]> &
  Pick<InstanceType<typeof ElInputNumber>["$props"]> &
  Pick<InstanceType<typeof ElLink>["$props"]> &
  Pick<InstanceType<typeof ElMenu>["$props"]> &
  Pick<InstanceType<typeof ElMenuItem>["$props"]> &
  Pick<InstanceType<typeof ElMenuItemGroup>["$props"]> &
  Pick<InstanceType<typeof ElPageHeader>["$props"]> &
  Pick<InstanceType<typeof ElPagination>["$props"]> &
  Pick<InstanceType<typeof ElPopconfirm>["$props"]> &
  Pick<InstanceType<typeof ElPopover>["$props"]> &
  Pick<InstanceType<typeof ElPopper>["$props"]> &
  Pick<InstanceType<typeof ElProgress>["$props"]> &
  Pick<InstanceType<typeof ElRadio>["$props"]> &
  Pick<InstanceType<typeof ElRadioButton>["$props"]> &
  Pick<InstanceType<typeof ElRadioGroup>["$props"]> &
  Pick<InstanceType<typeof ElRate>["$props"]> &
  Pick<InstanceType<typeof ElResult>["$props"]> &
  Pick<InstanceType<typeof ElRow>["$props"]> &
  Pick<InstanceType<typeof ElScrollbar>["$props"]> &
  Pick<InstanceType<typeof ElSelect>["$props"]> &
  Pick<InstanceType<typeof ElOption>["$props"]> &
  Pick<InstanceType<typeof ElOptionGroup>["$props"]> &
  Pick<InstanceType<typeof ElSelectV2>["$props"]> &
  Pick<InstanceType<typeof ElSkeleton>["$props"]> &
  Pick<InstanceType<typeof ElSkeletonItem>["$props"]> &
  Pick<InstanceType<typeof ElSlider>["$props"]> &
  Pick<InstanceType<typeof ElSpace>["$props"]> &
  Pick<InstanceType<typeof ElSteps>["$props"]> &
  Pick<InstanceType<typeof ElStep>["$props"]> &
  Pick<InstanceType<typeof ElSwitch>["$props"]> &
  Pick<InstanceType<typeof ElTable>["$props"]> &
  Pick<InstanceType<typeof ElTableColumn>["$props"]> &
  Pick<InstanceType<typeof ElTableV2>["$props"]> &
  Pick<InstanceType<typeof ElTabs>["$props"]> &
  Pick<InstanceType<typeof ElTabPane>["$props"]> &
  Pick<InstanceType<typeof ElTag>["$props"]> &
  Pick<InstanceType<typeof ElTimePicker>["$props"]> &
  Pick<InstanceType<typeof ElTimeSelect>["$props"]> &
  Pick<InstanceType<typeof ElTimeline>["$props"]> &
  Pick<InstanceType<typeof ElTimelineItem>["$props"]> &
  Pick<InstanceType<typeof ElTooltip>["$props"]> &
  Pick<InstanceType<typeof ElTransfer>["$props"]> &
  Pick<InstanceType<typeof ElTree>["$props"]> &
  Pick<InstanceType<typeof ElTreeSelect>["$props"]> &
  Pick<InstanceType<typeof ElTreeV2>["$props"]> &
  Pick<InstanceType<typeof ElUpload>["$props"]>

// 继承 element plus 组件事件并重写可选项有更好的 TS 类型提示，因为 ElAttrs 的值都为 any（属性名冲突而故意设置的）
export interface ElementProps extends ElAttrs {
  rules?: FormItemRule | FormItemRule[]
  size?:
    | "large"
    | "default"
    | "small"
    | number
    // eslint-disable-next-line
    | (string & {})
}

// element plus 标签名
export type ElNodeName =
  | "el-affix"
  | "el-alert"
  | "el-autocomplete"
  | "el-auto-resizer"
  | "el-avatar"
  | "el-backtop"
  | "el-badge"
  | "el-breadcrumb"
  | "el-breadcrumb-item"
  | "el-button"
  | "el-button-group"
  | "el-calendar"
  | "el-card"
  | "el-carousel"
  | "el-carousel-item"
  | "el-cascader"
  | "el-cascader-panel"
  | "el-check-tag"
  | "el-checkbox"
  | "el-checkbox-button"
  | "el-checkbox-group"
  | "el-col"
  | "el-collapse"
  | "el-collapse-item"
  | "el-collapse-transition"
  | "el-color-picker"
  | "el-config-provider"
  | "el-container"
  | "el-aside"
  | "el-footer"
  | "el-header"
  | "el-main"
  | "el-date-picker"
  | "el-descriptions"
  | "el-descriptions-item"
  | "el-dialog"
  | "el-divider"
  | "el-drawer"
  | "el-dropdown"
  | "el-dropdown-item"
  | "el-dropdown-menu"
  | "el-empty"
  | "el-form"
  | "el-form-item"
  | "el-icon"
  | "el-image"
  | "el-image-viewer"
  | "el-input"
  | "el-input-number"
  | "el-link"
  | "el-menu"
  | "el-menu-item"
  | "el-menu-item-group"
  | "el-page-header"
  | "el-pagination"
  | "el-popconfirm"
  | "el-popover"
  | "el-popper"
  | "el-progress"
  | "el-radio"
  | "el-radio-button"
  | "el-radio-group"
  | "el-rate"
  | "el-result"
  | "el-row"
  | "el-scrollbar"
  | "el-select"
  | "el-option"
  | "el-option-group"
  | "el-select-v2"
  | "el-skeleton"
  | "el-skeleton-item"
  | "el-slider"
  | "el-space"
  | "el-steps"
  | "el-step"
  | "el-switch"
  | "el-table"
  | "el-table-column"
  | "el-table-v2"
  | "el-tabs"
  | "el-tab-pane"
  | "el-tag"
  | "el-time-picker"
  | "el-time-select"
  | "el-timeline"
  | "el-timeline-item"
  | "el-tooltip"
  | "el-tooltip-v2"
  | "el-transfer"
  | "el-tree"
  | "el-tree-select"
  | "el-tree-v2"
  | "el-upload"
