import React from 'react';
import {
	ConnectButton,
	ConnectDialog,
	Connect2ICProvider,
	useConnect,
} from '@connect2ic/react';
import {
	BodyWrapper,
	Container,
	FormItemDesc,
	FormItemName,
	RedIcon,
	Required,
	Title,
	FormItem,
	Wrapper,
	FormWrapper,
	ConnectBtnSt,
} from './create-nft.elements';
import { Upload, message, Form, Input, Button, Skeleton, Select, Radio } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { client } from '../../utilities/ipfs';
import { superheroes } from '../../../declarations';
import { Principal } from '@dfinity/principal';
import { toList } from '../../utilities/idl';
import { idlFactory } from '../../../declarations/superheroes.did.js';
import { customAxios } from '../../utils/custom-axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { withContext } from '../../hooks';

const { Dragger } = Upload;
const { Option } = Select;
import { useCanister, useConnect } from '@connect2ic/react';
import { container } from 'webpack';

const IPFS_LINK = 'https://dweb.link/ipfs/';

function CreateNft(props) {
	const {
		isConnected,
		disconnect,
		activeProvider,
		isIdle,
		connect,
		isConnecting,
		principal
	} = useConnect();
	const [fileImg, setFileImg] = useState(true);
	const [listNFt, setListNFt] = useState([]);
	const [listAllNFt, setListAllNFt] = useState([]);
	const [superheroes, { loading, error }] = useCanister('superheroes');

	function onChange(value) {
		console.log(`selected ${value}`);
	}

	function onSearch(val) {
		console.log('search:', val);
	}

	const onChangeFile = async (info) => {
		const { status } = info.file;
		console.log(info);
		message.success(`${info.file.name} file uploaded successfully.`);
		return info.file;
	};
	const requestUpdate = async (info) => {
		const resImg = await onChangeFile(info);
		setFileImg(resImg);
		info.onSuccess('okk');
	};

	useEffect(async () => {
		if (principal && superheroes) {
			getLIst();
		}
	}, [principal, superheroes]);

	const getListAll = async () => {
		console.log('SUPERHEROES_CANISTER_ID', process.env.SUPERHEROES_CANISTER_ID);
		const res = await superheroes.getAllTokens();
		console.log(res);
		const promise4all = Promise.all(
			res.map(function (el) {
				return customAxios(el.metadata[0]?.tokenUri);
			})
		);
		const resu = await promise4all;
		console.log(resu);
		setListAllNFt(resu);
	};

	const onFinish = async (values) => {
		console.log(values);
		toast('Minting NFT!!!');
		const cid = await client.put([fileImg]);
		const nFile = new File(
			[
				JSON.stringify({
					description: values?.description,
					name: values?.name,
					image: `${IPFS_LINK}${cid}/${values?.image?.file?.name}`,
				}),
			],
			`${values?.name}.json`,
			{ type: 'text/plain' }
		);
		const metadataCID = await client.put([nFile]);
		const res = await superheroes.mint(Principal.fromText(principal), [
			{ tokenUri: `${IPFS_LINK}${metadataCID}/${values?.name}.json` },
		]);
		toast('Minted NFT success!!!');
		getLIst();
		getListAll();
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const getLIst = async () => {
		const res = await superheroes.getUserTokens(Principal.fromText(principal));
		const promise4all = Promise.all(
			res.map(function (el) {
				return customAxios(el.metadata[0]?.tokenUri);
			})
		);
		const resu = await promise4all;
		setListNFt(resu);
	};


	return (
		// <Container>
		// 	<Wrapper>
		// 		<Title>Create New Item</Title>
		// 		<Required>
		// 			<RedIcon>*</RedIcon> Required fields
		// 		</Required>

		// 		<BodyWrapper>
		// 			<Form
		// 				name='basic'
		// 				labelCol={{ span: 8 }}
		// 				wrapperCol={{ span: 16 }}
		// 				onFinish={onFinish}
		// 				onFinishFailed={onFinishFailed}
		// 				autoComplete='off'>
		// 				<FormWrapper>
		// 					<FormItem>
		// 						<Form.Item
		// 							name='image'
		// 							rules={[{ required: true, message: 'Please upload image!' }]}>
		// 							<Dragger customRequest={requestUpdate}>
		// 								<p className='ant-upload-drag-icon'>
		// 									<InboxOutlined />
		// 								</p>
		// 								<p className='ant-upload-text'>
		// 									Click or drag file to this area to upload
		// 								</p>
		// 								<p className='ant-upload-hint'>
		// 									Support for a single or bulk upload. Strictly prohibit
		// 									from uploading company data or other band files
		// 								</p>
		// 							</Dragger>
		// 						</Form.Item>
		// 					</FormItem>

		// 					<Form.Item
		// 						name='name'
		// 						rules={[{ required: true, message: 'Please input NFT name!' }]}>

		// 						<Input size='large' placeholder='NFT name' />
		// 					</Form.Item>

		// 					<Form.Item name='description'>
		// 						<Input
		// 							size='large'
		// 							placeholder='Provide a detailed description of your item'
		// 						/>
		// 					</Form.Item>

		// 					<FormItem>
		// 						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
		// 							<Button type='primary' htmlType='submit'>
		// 								Submit
		// 							</Button>
		// 						</Form.Item>
		// 					</FormItem>
		// 				</FormWrapper>
		// 			</Form>
		// 		</BodyWrapper>
		// 	</Wrapper>
		// </Container>
		<Container>
			<Wrapper>
				<Title>Register
					<Button className='ConnectBtnSt' style={{ WebkitBorderRadius: '10px', marginLeft: '20px'}}>
						Connect Wallet
					</Button>
				</Title>
				
				<FormItem>
					<Form.Item
						name='firstName'
						rules={[{ required: true, message: 'Please input your first name!' }]}>		
						<label htmlFor="firstName" >First name
							<Input  name='firstName' size='middle' placeholder='First name'/>
						</label>	
					</Form.Item>
					<Form.Item
						name='lastName'
						rules={[{ required: true, message: 'Please input your first name!' }]}>		
						<label htmlFor="lastName">Last name
							<Input name='lastName' size='middle' placeholder='Last name'/>
						</label>	
					</Form.Item>
					<Form.Item
						name='sex'
						rules={[{ required: true, message: 'Please input your sex!' }]}>		
						<label htmlFor="sex">Sex
							<Input style={{marginLeft: '10px'}} type="Radio" name='sex' value="Male"/> Male
							<Input style={{marginLeft: '10px'}} type="Radio" name='sex' value="Female"/> Female
						</label>	
					</Form.Item>
					<Form.Item
						name='date'
						rules={[{ required: true, message: 'Please input your date of birth!' }]}>		
						<label htmlFor="date">Date of birth
							<Input type="datetime-local" name='date'/> 
						</label>
					</Form.Item>
					<Form.Item
						name='phone'
						rules={[{ required: true, message: 'Please input your phone!' }]}>		
						<label htmlFor="phone">Phone 
							<Input type="text" size='middle' name='phone' placeholder='Phone'/> 
						</label >
					</Form.Item>
					<Form.Item
						name='address'
						rules={[{ required: true, message: 'Please input your address!' }]}>		
						<label htmlFor="address">Address
							<Input type="text" size='middle' name='address' placeholder='Address'/> 
						</label>
					</Form.Item>
					<FormItem>
						<Button className='ConnectBtnSt' style={{ WebkitBorderRadius: '10px',}}>
							Save
						</Button>
						<Button className='ConnectBtnSt' style={{ WebkitBorderRadius: '10px', marginLeft: '10px'}}>
							Cancel
						</Button>
					</FormItem>
				</FormItem>
			</Wrapper>
		</Container>

	);
}

export default withContext(CreateNft);
