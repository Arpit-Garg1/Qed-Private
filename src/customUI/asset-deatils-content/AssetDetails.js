import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { decryptData, imageType } from '../../_helperFunctions/HelperFunctions'
import * as AppUtil from '../../Util/AppUtil'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import * as global from '../../constants/global';
import CustomLoader from '../custom-loader/CustomLoader';

function AssetDeatils(props) {
    const params = useParams();
    const { hideThumbnail, setAssetDetailData, assetDataObj, setAssetDetailsNew, tabType } = props;
    const [pending, setPending] = useState(null);
    const [productData, setProductData] = useState(assetDataObj);
    const [currentImageUrl, setCurrentImageUrl] = useState(null)
    useEffect(() => {
        if (tabType == 0) {
            if (AppUtil.isNotNull(productData)) {
                setCurrentImageUrl(productData.imageData[0]?.fileUrl)
            }
        }
    }, [tabType]);

    useEffect(() => {
        if (decryptData(params.id)) {
            if (!AppUtil.isNotNull(productData)) {
                getProductDetails();
            } else {
                if (setAssetDetailsNew) {
                    setAssetDetailsNew(productData)
                }
            }
        }
    }, [params.id]);

    const settings = {
        arrows: hideThumbnail,
        infinite: false,
        dots: false
    }
    const navSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        dots: false,
        focusOnSelect: true,
        beforeChange: (oldIndex, newIndex) => {
        }
    }

    const getProductDetails = async () => {
        setPending(true);
        let variables = {
            id: decryptData(params.id)
        }
        let request = getRequestForApi(global.ASSET_PRODUCT_DETAILS, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let res = response?.data?.response?.data;
                setProductData(res)
                if (setAssetDetailsNew) setAssetDetailsNew(res)
                if (setAssetDetailData) setAssetDetailData(res)
                setCurrentImageUrl(res?.imageData[0]?.fileUrl)
                setPending(false);
            }
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        });
    };
    let productImage = '';
    if (productData?.imageData[0]?.fileUrl) {
        productImage = productData?.imageData[0]?.fileUrl;
    } else {
        productImage = imageType.DARK_SCREEN_TYPE;
    }

    const handleClickImage = (currentIndex) => {
        setCurrentImageUrl(productData?.imageData[currentIndex].fileUrl)
    }
    return (
        <>{pending ? <CustomLoader /> : <></>}
            <div className="mainContent mainContentAssetDetail">
                {/* <div className="backbutton backbtn"><Link to={path.ASSETS}><strong> &#8592;</strong></Link> <h2>Asset Details</h2>
                </div> */}
                <div className="card hasLoader">

                    <div className="assetsDetails">
                        {productData && !AppUtil.isListNullOrEmpty(productData.imageData) ?
                            <div className={!hideThumbnail ? 'photoHolder' : 'photoHolder imgSliderNew'}>
                                <div className='controls'>
                                    {hideThumbnail ?
                                        <Slider className='mainSlider' {...settings} >
                                            {productData?.imageData.map((data, index) => {
                                                return <img key={index} src={data.fileUrl} alt={index} width="200" height="200" />
                                            })}
                                        </Slider>
                                        : <img key={'fileUrl'} src={currentImageUrl} alt={'1'} width="200" height="200" />
                                    }


                                </div>
                                {!hideThumbnail ?
                                    <Slider className='sliderNav' {...navSettings} >
                                        {productData?.imageData.map((data, index) => {
                                            return <img key={index} src={data.fileUrl} alt={index} width="200" height="200" onClick={() => { handleClickImage(index) }} />
                                        })}
                                    </Slider>
                                    : <></>}
                            </div>

                            : null}
                        <div className='assetDetails-data'>
                            {productData?.owner ? <h3>Owner: {productData?.owner}</h3> : <></>}
                            <h5>Category: {productData?.category || ''}</h5>
                            <h5>Brand: {productData?.Brand?.name || ''}</h5>
                            <h5>Model: {productData?.Model?.name || ''}</h5>
                            {productData?.serialNo ? <h5>Serial Number: {productData?.serialNo || ''}</h5> : <></>}
                            {productData?.upcCode ? <h5>UPC Code: {productData?.upcCode || ''}</h5> : <></>}
                            <h5>Is Linked: {!AppUtil.isListNullOrEmpty(productData?.linkFrom) ? 'Yes' : 'No'}</h5>
                            <h5>Is Owned by me: {!AppUtil.isNullOrEmptyNew(productData?.isOwned) && productData?.isOwned == 'Y' ? 'Yes' : 'No'}</h5>
                            {!AppUtil.isNullOrEmptyNew(productData?.tokenId) ? <h5>Token Id: {productData?.tokenId}</h5> : null}
                            {!AppUtil.isNullOrEmptyNew(productData?.description) ? <h5>Description: {productData?.description}</h5> : null}
                            <h5>
                                TokenStatus: {!productData?.isVoided && !productData?.isExpired ? 'Ok' :
                                    productData?.isVoided && productData?.isExpired ? 'Expired' :
                                        productData?.isVoided && !productData?.isExpired ? 'Voided' : 'Expired'
                                }
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssetDeatils